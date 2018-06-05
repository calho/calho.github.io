function createHeader(main="") {
    document.getElementById("mainNav").innerHTML =
        '<div class="container">' +
        '<a class="navbar-brand js-scroll-trigger" href="'+main+'#page-top">Calvin Ho</a>' +
        '<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">' +
        '<span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="navbarResponsive">'+
        '<ul class="navbar-nav ml-auto">' +
        '<li class="nav-item">' +
        '<a class="nav-link js-scroll-trigger" href="'+main+'#about">About</a>' +
        '</li>' +
        '<li class="nav-item">' +
        '<a class="nav-link js-scroll-trigger" href="'+main+'#highlights">Highlights</a>' +
        '</li>' +
        '<li class="nav-item">' +
        '<a class="nav-link js-scroll-trigger" href="'+main+'#portfolio">Portfolio</a>' +
        '</li>' +
        '<li class="nav-item">' +
        '<a class="nav-link js-scroll-trigger" href="'+main+'#contact">Contact</a>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>'
}

// document.getElementById("mainNav").innerHTML =
//     '<div class="container">' +
//         '<a class="navbar-brand js-scroll-trigger" href="../index.html#page-top">Calvin Ho</a>' +
//         '<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">' +
//             '<span class="navbar-toggler-icon"></span>' +
//         '</button>' +
//         '<div class="collapse navbar-collapse" id="navbarResponsive">'+
//             '<ul class="navbar-nav ml-auto">' +
//                 '<li class="nav-item">' +
//                     '<a class="nav-link js-scroll-trigger" href="../index.html#about">About</a>' +
//                 '</li>' +
//                 '<li class="nav-item">' +
//                     '<a class="nav-link js-scroll-trigger" href="../index.html#highlights">Highlights</a>' +
//                 '</li>' +
//                 '<li class="nav-item">' +
//                     '<a class="nav-link js-scroll-trigger" href="../index.html#portfolio">Portfolio</a>' +
//                 '</li>' +
//                 '<li class="nav-item">' +
//                     '<a class="nav-link js-scroll-trigger" href="../index.html#contact">Contact</a>' +
//                 '</li>' +
//             '</ul>' +
//         '</div>' +
//     '</div>'

