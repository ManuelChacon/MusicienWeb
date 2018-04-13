function corregirLong() {
    long = 0;
    long = document.getElementById("container").scrollHeight;
    long = +(long)+160;
    document.getElementById("menuleft").style.height = "" + long + "px";
}
