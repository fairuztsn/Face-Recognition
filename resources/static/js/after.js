function get(param) {
    var $_GET = {};
    if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
                    .toString()
                    .replace(/^.*?\?/, '')
                    .replace(/#.*$/, '')
                    .split('&');

        for(var i=0, l=query.length; i<l; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            $_GET[aux[0]] = aux[1];
        }
    }

    return $_GET[param];
}


$( document ).ready(function() {
    console.log("READY!");
    let message = "";

    const status = get("s");

    let text = document.querySelector("#text");
    let button = document.querySelector("#btn-try-again");
    let img = document.querySelector("#img");
    
    img.style.display = "none";

    if(status == 1){
        img.style.display = "block";
        button.style.display = "none";
        message = "Kamu sudah melakukan presensi masuk !! <⁠(⁠￣⁠︶⁠￣⁠)⁠>";
    }else if(status == 2){
        img.style.display = "block";
        button.style.display = "none";
        message = "Presensi hari ini sudah selesai!! (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)⁠✧";
    }else {
        message = "Presensi gagal desu (⁠-_-⁠メ⁠)";
        img.style.display = "none";
    }

    $("#text").text(message);
    text.style.fontSize = "100px;";
});