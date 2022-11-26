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
    let img = document.querySelector("#img");

    if(status == 1){
        $('#btn-try-again').hide();
        message = "Yay! presensi masuk selesai!! <⁠(⁠￣⁠︶⁠￣⁠)⁠>";
    }else if(status == 2 || status == "2"){
        $("#btn-try-again").hide();
        message = "Presensi keluar selesai (⁠ ⁠╹⁠▽⁠╹⁠ ⁠)⁠✧";
    }else {
        $('#id').show();
        message = "Presensi gagal desu~ (⁠｡⁠ŏ⁠﹏⁠ŏ⁠)";     
    }

    $("#text").text(message);
    text.style.fontSize = "100px;";
});