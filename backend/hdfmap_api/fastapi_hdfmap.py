"""
FastAPI webapp backend server using hdfmap
"""

import os
import logging
import numpy as np
import hdfmap

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

from .functions import list_scan_files, get_latest_file, get_dls_visits, hdf_tree_dict


app = FastAPI()
logger = logging.getLogger(__name__)
logger.setLevel(10)

class GetScan(BaseModel):
    datadir: str
    filename: str
    format: str
    xaxis: str 
    yaxis: str
    evalArg: str

# mutable memory
VISITS = {}
SCANS = {}


@app.get("/api/{instrument}/{year}")
async def get_visits(instrument: str, year: str):
    if (key := instrument + year) not in VISITS:
        logger.info(f"Getting visits from /dls/{instrument}/data/{year}")
        VISITS[key] = get_dls_visits(instrument, year)
    return VISITS[key]


@app.post("/api/get-last-scan/")
async def get_last_scan(message: GetScan):
    logger.info('Get latest file')
    latest_file = get_latest_file(message.datadir)
    logger.debug(f"Latest file: {latest_file}")
    # scanno = nexus_scan_number(latest_file)
    # logger.debug(f"Latest Scanno = {scanno}")
    return {"response": latest_file}


@app.post("/api/get-all-scans/")
async def get_all_scans(message: GetScan):
    if message.datadir not in SCANS:
        logger.info(f"Get all scan files from '{message.datadir}'")
        SCANS[message.datadir] = [p.name for p in list_scan_files(message.datadir)]
    else:
        logger.info(f"scans from memory: {message.datadir}")
    return {"list": SCANS[message.datadir]}


@app.post("/api/get-scan-format/")
async def get_scan_format(message: GetScan):
    logger.info('Get scan format')
    scan_file = os.path.join(message.datadir, message.filename)
    if os.path.isfile(scan_file):
        scan = hdfmap.NexusLoader(scan_file)
        try:
            rsp = scan.format(message.format)
        except Exception as ex:
            rsp = str(ex)
    else:
        rsp = f"File '{scan_file}' does not exist"
    logger.debug(f"Response: {rsp}")
    return {"response": rsp}


@app.post("/api/get-scan-data/")
async def get_scan_data(message: GetScan):
    logger.info('Get scan data')
    scan_file = os.path.join(message.datadir, message.filename)
    response = {
        "response": '',
        'xdata': [],
        'ydata': [],
        'xlabel': '',
        'ylabel': '',
        'data': {},
        'tree': {},
        'evalOutput': 'filename',
    }
    if os.path.isfile(scan_file):
        nxmap = hdfmap.create_nexus_map(scan_file)
        try:
            
            if message.xaxis and message.yaxis:
                axes_name = nxmap.datasets[path].name if (path := nxmap.get_path(message.xaxis)) else message.xaxis
                signal_name = nxmap.datasets[path].name if (path := nxmap.get_path(message.yaxis)) else message.yaxis
            else:
                axes_paths, signal_path = nxmap.nexus_defaults()
                axes_name = nxmap.datasets[axes_paths[0]].name
                signal_name = nxmap.datasets[signal_path].name
            logger.debug(f"axes_name = {axes_name}\nsignal_name = {signal_name}")
            
            with nxmap.load_hdf() as hdf:
                axes_data = nxmap.eval(hdf, axes_name)
                signal_data = nxmap.eval(hdf, signal_name)
                scan_data = nxmap.get_scannables(hdf)
                rsp = nxmap.format_hdf(hdf, message.format)
                eval_output = nxmap.eval(hdf, message.evalArg)
            
            if not issubclass(type(axes_data), np.ndarray) or not np.issubdtype(axes_data.dtype, np.number) or np.size(axes_data) != nxmap.scannables_length():
                axes_name = '![fail]' + axes_name
                axes_data = np.arange(nxmap.scannables_length())
            if not issubclass(type(signal_data), np.ndarray) or not np.issubdtype(signal_data.dtype, np.number) or np.size(signal_data) != nxmap.scannables_length():
                signal_name = '![fail]' + signal_name
                signal_data = np.ones(nxmap.scannables_length())

            response['data'] = {name: array.tolist() for name, array in scan_data.items()}
            response['tree'] = hdf_tree_dict(scan_file)
            response['xlabel'] = axes_name
            response['ylabel'] = signal_name
            response['xdata'] = axes_data.tolist()
            response['ydata'] = signal_data.tolist()
            # response['response'] = f"x={axes_name}, y={signal_name}, scan length={len(scan_data[signal_name])}"
            response['response'] = rsp
            response['evalOutput'] = str(eval_output)
        except Exception as ex:
            response['response'] = str(ex)
    else:
        response['response'] = f"File '{scan_file}' does not exist"
    logger.debug(response['response'])
    return response

@app.post("/api/start_notebook/")
async def start_notebook(message: GetScan):
    logger.info('start notebook')
    import subprocess
    subprocess.run('jupyter notebook', shell=True)

    rsp = 'OK'
    logger.debug(f"Response: {rsp}")
    return {"response": rsp}


# Create entry-point for frontend website
# Mounts the `static` folder within the `build` folder to the `/static` route.
# The order really matters! This must go last
# INDEX = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend/dist/index.html'))
INDEX = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend/dist'))
logger.info(f'!!! Frontend: {INDEX}, isfile: {os.path.isfile(INDEX)}')
app.mount('/', StaticFiles(directory=INDEX, html=True), 'frontend')
