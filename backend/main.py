"""
No longer used!

Still here just to keep the comments

Look at hdfmap_api.fastapi_hdfmap instead
"""

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request

import os
import re
import numpy as np
import hdfmap


app = FastAPI()
 
# declare origin/s
# origins = [
#     "http://localhost:5173",
#     "localhost:5173"
# ]

# # Allow CORS for the frontend (local servers can't talk to onanother without this)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], #origins,  # Adjust based on your React setup
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Sets the templates directory to the `build` folder from `npm run build`
# this is where you'll find the index.html file.
# templates = Jinja2Templates(directory="../frontend/dist")
 


 
class Message(BaseModel):
    text: str


class GetScan(BaseModel):
    datadir: str
    filespec: str
    scanno: int
    format: str
    xaxis: str 
    yaxis: str


def list_scan_files(directory: str, extension='.nxs') -> list[str]:
    """Return list of files in directory with extension, returning list of full file paths"""
    try:
        return sorted(
            (file.path for file in os.scandir(directory) if file.is_file() and file.name.endswith(extension)),
            key=lambda x: os.path.getmtime(x)
        )
    except FileNotFoundError:
        return []


def get_latest_file(directory, extension='.nxs'):
    """Return latest file in directory"""
    return max(
        (p for p in os.scandir(directory) if p.name.endswith(extension)), 
        key=os.path.getmtime
    )


def nexus_scan_number(filename: str) -> int:
    """
    Generate scan number from file, use entry_identifier or generate file filename
    :param filename: name of nexus file
    :return: int
    """
    scan = hdfmap.NexusLoader(filename)
    if 'entry_identifier' in scan.map:
        return int(scan.get_data('entry_identifier'))
    name = os.path.splitext(os.path.basename(filename))[0]
    numbers = re.findall(r'\d{4,}', name)
    if numbers:
        return int(numbers[0])
    return 0


@app.post("/api/get-last-scan/")
async def get_last_scan(message: GetScan):
    print('Get latest file')
    extension = os.path.splitext(message.filespec)[-1]
    latest_file = get_latest_file(message.datadir, extension)
    print(f"Latest file: {latest_file}")
    scanno = nexus_scan_number(latest_file)
    print(f"Latest Scanno = {scanno}")
    return {"response": str(scanno)}


@app.post("/api/get-all-scans/")
async def get_all_scans(message: GetScan):
    extension = os.path.splitext(GetScan.filespec)[-1]
    return {"response": list_scan_files(GetScan.datadir, extension)}


@app.post("/api/get-scan-format/")
async def get_scan_format(message: GetScan):
    print(message)
    scanno = int(message.scanno)
    scan_file = os.path.join(message.datadir, message.filespec % scanno)
    if os.path.isfile(scan_file):
        scan = hdfmap.NexusLoader(scan_file)
        try:
            rsp = scan.format(message.format)
        except Exception as ex:
            rsp = str(ex)
    else:
        rsp = f"File '{scan_file}' does not exist"
    print(f"Response: {rsp}")
    return {"response": rsp}


@app.post("/api/get-scan-data/")
async def get_scan_data(message: GetScan):
    print(message)
    scanno = int(message.scanno)
    scan_file = os.path.join(message.datadir, message.filespec % scanno)
    response = {
        "response": '',
        'xdata': [],
        'ydata': [],
        'xlabel': '',
        'ylabel': '',
        'data': {}
    }
    if os.path.isfile(scan_file):
        nxmap = hdfmap.create_nexus_map(scan_file)
        try:
            
            if message.xaxis and message.yaxis:
                print('got here')
                axes_name = nxmap.datasets[path].name if (path := nxmap.get_path(message.xaxis)) else message.xaxis
                signal_name = nxmap.datasets[path].name if (path := nxmap.get_path(message.yaxis)) else message.yaxis
            else:
                axes_paths, signal_path = nxmap.nexus_defaults()
                axes_name = nxmap.datasets[axes_paths[0]].name
                signal_name = nxmap.datasets[signal_path].name
            print(f"axes_name = {axes_name}\nsignal_name = {signal_name}")
            
            with nxmap.load_hdf() as hdf:
                axes_data = nxmap.eval(hdf, axes_name)
                signal_data = nxmap.eval(hdf, signal_name)
                scan_data = nxmap.get_scannables(hdf)
            
            if not issubclass(type(axes_data), np.ndarray) or not np.issubdtype(axes_data.dtype, np.number) or len(axes_data) != nxmap.scannables_length():
                axes_name = '![fail]' + axes_name
                axes_data = np.arange(nxmap.scannables_length())
            if not issubclass(type(signal_data), np.ndarray) or not np.issubdtype(signal_data.dtype, np.number) or len(signal_data) != nxmap.scannables_length():
                signal_name = '![fail]' + signal_name
                signal_data = np.ones(nxmap.scannables_length())

            response['data'] = {name: array.tolist() for name, array in scan_data.items()}
            response['xlabel'] = axes_name
            response['ylabel'] = signal_name
            response['xdata'] = axes_data.tolist()
            response['ydata'] = signal_data.tolist()
            response['response'] = f"x={axes_name}, y={signal_name}, scan length={len(scan_data[signal_name])}"
        except Exception as ex:
            response['response'] = str(ex)
    else:
        response['response'] = f"File '{scan_file}' does not exist"
    print(response['response'])
    return response


@app.post("/send-message/")
async def send_message(message: Message):
    response_text = f"Received message: {message.text}"
    return {"response": response_text}


@app.get("/msg/{msg_txt}")
async def read_msg(msg_txt: str):
    return {"msg_txt": msg_txt}


# Mounts the `static` folder within the `build` folder to the `/static` route.
# The order really matters! This must go last
print(f'!!! Frontend: {os.path.abspath('../frontend/dist/index.html')}, isfile: {os.path.isfile('../frontend/dist/index.html')}')
app.mount('/', StaticFiles(directory="../frontend/dist", html=True), 'frontend')


# Defines a route handler for `/*` essentially.
# NOTE: this needs to be the last route defined b/c it's a catch all route
# @app.get("/{rest_of_path:path}")
# async def react_app(req: Request, rest_of_path: str):
#     return templates.TemplateResponse('index.html', { 'request': req })

