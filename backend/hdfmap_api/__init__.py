"""
FastAPI webapp backend server using hdfmap
"""

import logging

logging.basicConfig()

from .fastapi_hdfmap import app

__all__ = ['app']
