const { ipcRenderer, desktopCapturer } = require('electron');

const handleStream = (stream) => {
    const video = document.querySelector('#video');
    video.srcObject = stream;

    const videoTrack = video.srcObject.getVideoTracks()[0];
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
};

const handleError = (error) => {
  debugger
};

window.onload = () => {
    const button = document.querySelector('#button');
    button.addEventListener('click', () => {
        ipcRenderer.send('capture');
    });

    const canvas = document.querySelector('#img') ;

    ipcRenderer.on('window-id', (event, data) => {
        const id = data.id;

        desktopCapturer.getMediaSourceIdForWebContents(id).then(async (mediaSourceId) => {
            console.log('mediaSourceId', mediaSourceId);

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  audio: {
                    mandatory: {
                      chromeMediaSource: 'tab',
                      chromeMediaSourceId: mediaSourceId
                    }
                  },
                  video: {
                    mandatory: {
                      chromeMediaSource: 'tab',
                      chromeMediaSourceId: mediaSourceId,
                      minWidth: 1280,
                      maxWidth: 1280,
                      minHeight: 720,
                      maxHeight: 720,
                    }
                  }
                })
                handleStream(stream)

                const track = stream.getVideoTracks()[0];
                const imageCapture = new ImageCapture(track);

                const img = await imageCapture.grabFrame();

                canvas.width = getComputedStyle(canvas).width.split('px')[0];
                canvas.height = getComputedStyle(canvas).height.split('px')[0];

                let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
                let x = (canvas.width - img.width * ratio) / 2;
                let y = (canvas.height - img.height * ratio) / 2;

                const bufferCanvas = new OffscreenCanvas(canvas.width, canvas.height);

                bufferCanvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                bufferCanvas.getContext('2d').fillStyle = 'red';
                bufferCanvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);
                bufferCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
                    x, y, img.width * ratio, img.height * ratio);

                const imageData = bufferCanvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)

                canvas.getContext('2d').putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);

                // for (let i = 0, len = imageData.data.length; i < len; i = i + 4) {
                //   console.log(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3])
                // }
              } catch (e) {
                handleError(e)
              }
        });
    });
};
