# fastapi-react-app
My first attempt at a working web-app using fastapi, Vite + React + TypeScript + materials ui

### Installation
```
$ conda create -n myreactenv nodejs python pnpm
$ conda activate myreactenv
$ git clone https://github.com/DanPorter/fastapi-react-app.git

$ cd fastapi-react-app/frontend
$ pnpm install
$ pnpm build

$ cd fastapi-react-app/backend
$ python -m pip install .
```

### Run
```
$ conda activate myreactenv
$ cd fastapi-react-app/backend
$ python -m hdfmap_api
```