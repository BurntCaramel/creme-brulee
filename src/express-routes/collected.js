route.get('/@:username/:hash', routeRendering(collected.serveFileRequest))
route.post('/@:username/:hash', routeRendering(collected.uploadFileRequest))