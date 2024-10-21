
import uvicorn
import webbrowser

from hdfmap_api import app

if __name__ == '__main__':
    webbrowser.open_new_tab('http://localhost:8000/')
    uvicorn.run("hdfmap_api:app", host="0.0.0.0", port=8000, log_level="info", access_log=False, reload=True)
    