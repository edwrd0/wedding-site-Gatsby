'use strict';   // Mode strict du JavaScript

/***********************************************************************************/
/* ********************************* DONNEES CARROUSEL *****************************/
/***********************************************************************************/

// Codes des touches du clavier.
const TOUCHE_ESPACE = 32;
const TOUCHE_GAUCHE = 37;
const TOUCHE_DROITE = 39;


// La liste des slides du carrousel.

var slides = [];

// Objet contenant l'état du carrousel.
var state;

var listLength = 0; 

/***********************************************************************************/
/* ******************************** FONCTIONS CARROUSEL ****************************/
/***********************************************************************************/

function setFlickrdata(data) {     //function to use AJAX calls to pull the Flickr photoset as JSON.

    for (var i=0; i < data.photoset.photo.length ; ++i)

    {
        var link = "http://www.flickr.com/photos/" + data.photoset.owner + "/" + data.photoset.photo[i].id ;
        
        var src = "http://farm" + data.photoset.photo[i].farm + ".static.flickr.com/" + data.photoset.photo[i].server + "/" + data.photoset.photo[i].id + "_" + 
        data.photoset.photo[i].secret + ".jpg";
        
        var alt = "photo numéro: " + data.photoset.photo[i].title ;
        
        var photo = { link: link, src: src, alt: alt};
        slides.push( photo );

        
        listLength += 1;
    }
    refreshSlider();
}

function slideshow(photoset) {                 //function that initializes AJAX call and slideshow 
    var url = 'https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&api_key=fc8d0bce9e99848af3ff4f9a0a79bf28&photoset_id='+ photoset + '&jsoncallback=?';
    $.getJSON( url , setFlickrdata);
}

function onSliderGoToNext()
{
    // Passage à la slide suivante.
    state.index++;

    // Est-ce qu'on est arrivé à la fin de la liste des slides ?
    if(state.index == slides.length)
    {
        // Oui, on revient au début (le carrousel est circulaire).
        state.index = 0;
    }

    // Mise à jour de l'affichage.
    refreshSlider();
}

function onSliderGoToPrevious()
{
    // Passage à la slide précédente.
    state.index--;

    // Est-ce qu'on est revenu au début de la liste des slides ?
    if(state.index < 0)
    {
        // Oui, on revient à la fin (le carrousel est circulaire).
        state.index = slides.length - 1;
    }

    // Mise à jour de l'affichage.
    refreshSlider();
}

function onSliderGoToRandom()
{
    var index;

    do
    {
        /*
         * Récupération d'un numéro de slide aléatoire différent
         * du numéro de slide actuel.
         */
        index = getRandomInteger(0, slides.length - 1);
    }
    while(index == state.index);

    // Passage à une slide aléatoire.
    state.index = index;

    // Mise à jour de l'affichage.
    refreshSlider();
}

/*
 * Quand on créé un gestionnaire d'évènements, le navigateur appelle la
 * fonction en fournissant un argument event représentant l'évènement lui-même.
 *
 * Si le gestionnaire d'évènements n'a pas besoin de cet argument,
 * inutile de le déclarer !
 *
 * Mais ici on va en avoir besoin...
 */
function onSliderKeyUp(event)
{
    /*
     * Les gestionnaires d'évènements d'appui sur une touche (évènements
     * keydown, keyup, keypress) contiennent une propriété keyCode dans l'objet
     * event représentant le code de la touche du clavier.
     *
     * Il existe de très nombreux codes, plus ou moins standards, voir la page :
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
     */

    switch(event.keyCode)
    {
        case TOUCHE_DROITE:
        // On passe à la slide suivante.
        onSliderGoToNext();
        break;

        case TOUCHE_ESPACE:
        // On démarre ou on arrête le carrousel.
        onSliderToggle();
        break;

        case TOUCHE_GAUCHE:
        // On passe à la slide précédente.
        onSliderGoToPrevious();
        break;
    }
}

function onSliderToggle()
{
    var icon;

    // Modification de l'icône du bouton pour démarrer ou arrêter le carrousel.
    // icon = document.querySelector('#slider-toggle i');

    // icon.classList.toggle('fa-play');
    // icon.classList.toggle('fa-pause');

    // Est-ce que le carousel est démarré ?
    if(state.timer == null)
    {
        // Non, démarrage du carousel, toutes les deux secondes.
        state.timer = window.setInterval(onSliderGoToNext, 2000);

        /*
         * Modification du libellé du bouton en mode "OFF".
         *
         * La variable spéciale this est automatiquement initialisée par le
         * navigateur avec l'objet DOM qui a déclenché l'évènement.
         *
         * C'est le bouton "Démarrer/Arrêter le carrousel" qui a déclenché
         * l'évènement, donc la variable spéciale this vaut la même chose
         * que l'objet renvoyé par document.querySelector('#js-slider-toggle');
         */
        // this.title = 'Arrêter le carrousel';
    }
    else
    {
        // Oui, arrêt du carousel.
        window.clearInterval(state.timer);

        // Réinitialisation de la propriété pour le prochain clic sur le bouton.
        state.timer = null;

        /*
         * Modification du libellé du bouton en mode "ON".
         *
         * La variable spéciale this est automatiquement initialisée par le
         * navigateur avec l'objet DOM qui a déclenché l'évènement.
         *
         * C'est le bouton "Démarrer/Arrêter le carrousel" qui a déclenché
         * l'évènement, donc la variable spéciale this vaut la même chose
         * que l'objet renvoyé par document.querySelector('#js-slider-toggle');
         */
        // this.title = 'Démarrer le carrousel';
    }
}

function onToolbarToggle()
{
    var icon;

    // Modification de l'icône du lien pour afficher ou cacher la barre d'outils.
    icon = document.querySelector('#toolbar-toggle i');

    icon.classList.toggle('fa-arrow-down');
    icon.classList.toggle('fa-arrow-right');

    /*
     *  Les deux lignes de code ci-dessus sont équivalentes à :
     *
     *
     *  if(icon.classList.contains('fa-arrow-right') == true)
     *  {
     *      icon.classList.remove('fa-arrow-right');
     *      icon.classList.add('fa-arrow-down');
     *  }
     *  else
     *  {
     *      icon.classList.add('fa-arrow-right');
     *      icon.classList.remove('fa-arrow-down');
     *  }
     */

    // Affiche ou cache la barre d'outils.
    document.querySelector('.toolbar ul').classList.toggle('hide');
}

function refreshSlider()
{
    var sliderLink;
    var sliderSrc;
    var sliderAlt;

    // Recherche des balises de contenu du carrousel.
    sliderSrc  = document.querySelector('#slider img');
    sliderLink = document.querySelector('#slider a');
    sliderAlt = document.querySelector('#slider img');


    // Changement de la source de l'image et du texte de la légende du carrousel.
    //setTimeout(function(){
    sliderSrc.src = slides[state.index].src;
    sliderLink.href = slides[state.index].link;
    sliderAlt.alt = slides[state.index].alt;
//},500);
}


/***********************************************************************************/
/* ******************************** CODE PRINCIPAL *********************************/
/***********************************************************************************/

/*
 * Installation d'un gestionnaire d'évènement déclenché quand l'arbre DOM sera
 * totalement construit par le navigateur.
 *
 * Le gestionnaire d'évènement est une fonction anonyme que l'on donne en deuxième
 * argument directement à document.addEventListener().
 */
document.addEventListener('DOMContentLoaded', function()
{
    // Initialisation du carrousel.
    state       = {};
    state.index = 0;                   // On commence à la première slide
    state.timer = null;                // Le carrousel est arrêté au démarrage


    // Installation des gestionnaires d'évènement.
    // installEventHandler('#slider-random', 'click', onSliderGoToRandom);
    // installEventHandler('#slider-previous', 'click', onSliderGoToPrevious);
    // installEventHandler('#slider-next', 'click', onSliderGoToNext);
    // installEventHandler('#slider-toggle', 'click', onSliderToggle);
    // installEventHandler('#toolbar-toggle', 'click', onToolbarToggle);

    /*
     * L'évènement d'appui sur une touche doit être installé sur l'ensemble de la
     * page, on ne recherche pas une balise en particulier dans l'arbre DOM.
     *
     * L'ensemble de la page c'est la balise <html> et donc la variable document.
     */
    document.addEventListener('keyup', onSliderKeyUp);
    // Equivalent à installEventHandler('html', 'keyup', onSliderKeyUp);


    // Affichage initial.
    slideshow('72157692268541585');
    onSliderToggle();

});