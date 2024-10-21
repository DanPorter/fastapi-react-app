"""
Functions for use in fastapi_hdfmap
"""

import os
import re
import logging
import hdfmap

from h5py import Group, Dataset, ExternalLink, SoftLink


logger = logging.getLogger(__name__)


def list_scan_files(directory: str, extension='.nxs') -> list[str]:
    """Return list of files in directory with extension, returning list of full file paths"""
    try:
        return sorted(
            (file for file in os.scandir(directory) if file.is_file() and file.name.endswith(extension)),
            key=os.path.getmtime
        )
    except FileNotFoundError:
        return []


def get_dls_visits(instrument: str, year: str) -> dict[str]:
    """Return list of visits"""
    dls_dir = os.path.join('/dls', instrument.lower(), 'data', year)
    logger.debug(f"dls_dir = {dls_dir}")
    if os.path.isdir(dls_dir):
        return {p.name: p.path for p in os.scandir(dls_dir) if p.is_dir()}
    logger.warning(f"Path '{dls_dir}' does not exist")
    return {}


def get_latest_file(directory: str, extension='.nxs') -> str:
    """Return latest file in directory"""
    try:
        return max(
            (p for p in os.scandir(directory) if p.name.endswith(extension)), 
            key=os.path.getmtime
        ).name
    except (ValueError, FileNotFoundError):
        return ''


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
    logger.warning(f"Filename: '{name}' can't be reduced to number")
    return 0


def hdf_tree_dict(hdf_filename: str) -> dict:
    """
    Generate summary dict of the hdf tree structure
    The structure is:
        {'group': {'@attrs': str, 'sub-group': {}, 'dataset': str}, ...}

    Group attributes are stored with names pre-fixed with '@'

    :param hdf_filename: filename of hdf file
    :return: {'entry': {'dataset': 'value'}...}
    """

    def store(hdf_dict: dict, hdf_group: Group) -> dict:
        for key in hdf_group:
            obj = hdf_group.get(key)
            link = hdf_group.get(key, getlink=True)
            if obj is None:
                hdf_dict[key] = '! Missing'
                continue  # dataset may be missing due to a broken link
            # Group
            if isinstance(obj, Group):
                hdf_dict[key] = {f"@{attr}": str(val) for attr, val in obj.attrs.items()}
                store(hdf_dict[key], obj)
            # Dataset
            elif isinstance(obj, Dataset):
                if obj.size <= 1:
                    detail = str(obj[()])
                else:
                    detail = f"{obj.dtype}, {obj.shape}"
                if isinstance(link, (SoftLink, ExternalLink)):
                    detail = f"LINK: " + detail
                hdf_dict[key] = detail
        return hdf_dict
    return store({}, hdfmap.load_hdf(hdf_filename))
