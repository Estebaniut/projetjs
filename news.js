var recherches=[];//tableau contenant des chaines de caracteres correspondant aux recherches stockees
var recherche_courante;// chaine de caracteres correspondant a la recherche courante
var $zone_saisie = $("#zone_saisie");
var recherche_courante_news=[]; // tableau d'objets de type resultats (avec titre, date et url)
var autocompletion=[];//tableau contenant des chaines de caracteres correspondant à toutes les recherches faites

function ajouter_recherche()
{
	//Si le tableau des recherches ne contient pas la recherche courante alors on ajoute la sauvegarde dans le tableau
	if (recherches.indexOf($zone_saisie.val())==-1){
			recherches.push($zone_saisie.val());

			//Création d'un nouveau paragraphe à partir de la recherche courante
			var new_recherche = $('<p class="titre-recherche"><label>'+$zone_saisie.val()+'</label><img src="croix30.jpg" class="icone-croix"/> </p>');
			$("#recherches-stockees").append(new_recherche);
			$("#recherches-stockees label").attr("onClick","selectionner_recherche(this)");
			$("#recherches-stockees img").attr("onClick","supprimer_recherche(this)");
	}
	//Sauvegarde du tableau "recherches"
	localStorage.setItem("recherches",JSON.stringify(recherches));
	// $.cookie("recherches",JSON.stringify(recherches));
}

function supprimer_recherche(e)
{
	//Récupération du parent de l'élément cliqué
	$parent = $(e).parent();

	//Suppression de la recherche dans le tableau "recherches"
	recherches.splice(recherches.indexOf($parent.children("label").text()),1);
	$parent.remove();

	//Suppression de la recherche ainsi que les éléments qui était sauvegarder dans la recherche
	localStorage.removeItem($parent.children("label").text());
	localStorage.setItem("recherches",JSON.stringify(recherches));
	// $.cookie("recherches",JSON.stringify(recherches));
}


function selectionner_recherche(e)
{
		valeur = $(e).text();
		$zone_saisie.val(valeur);
		recherche_courante = valeur;
		recherche_courante_news = [];
		recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
		// recherche_courante_news = JSON.parse($.cookie(recherche_courante));
		$("#resultats").children('p').each(function(){	//Suppression de toutes les divs de #resultats
			this.remove();
		})

		//Affichage de toutes les recherches contenu dans la recherche-stockees cliqué
		for (var i = 0; i < recherche_courante_news.length; i++) {
			var content_recherche = $('<p class="titre_result"><a class="titre_news" href="'+recherche_courante_news[i].url+'" target="_blank">'+recherche_courante_news[i].titre+'</a><span class="date_news">'+recherche_courante_news[i].date+'</span><span class="action_news" onclick="supprime_news(this)"><img src="disk15.jpg"/></span></p>');
			$("#resultats").append(content_recherche);
		}
}


function init()
{
	// localStorage.clear();

	// DRAG & DROP des recherches-stockees
	$( function() {
		$( "#recherches-stockees" ).sortable();
		$( "#recherches-stockees" ).disableSelection();
	} );

	// Si un cookie "recherches" existe alors on initialise recherches avec le contenu du cookie
	// if (!!$.cookie("recherches")) {
	if(localStorage.getItem("recherches")){
		var $content_cookie = JSON.parse(localStorage.getItem("recherches"));	//Array du contenu du cookie
		// var $content_cookie = JSON.parse($.cookie("recherches"));	//Array du contenu du cookie
		for (var i = 0; i < $content_cookie.length; i++) {	//Ajout du contenu
			recherches.push($content_cookie[i]);
			var new_recherche = $('<p class="titre-recherche"><label>'+recherches[i]+'</label><img src="croix30.jpg" class="icone-croix"/> </p>');
			$("#recherches-stockees").append(new_recherche);
			$("#recherches-stockees label").attr("onClick","selectionner_recherche(this)");
			$("#recherches-stockees img").attr("onClick","supprimer_recherche(this)");
		}
	}

	//L'appui sur entrer lance une nouvelle recherche
	$("#zone_saisie").keypress(function(e){
		if(e.which == 13){//Enter key pressed
			recherche_nouvelles();//Appel de la fonction recherche_nouvelles
		}
	});

	//Autocompletion
	$(function(){
		$("#zone_saisie").autocomplete({
			source: autocompletion
		});
	});

	// Initialisation du tableau autocompletation
	// if (!!$.cookie("autocompletion")) {
	if (localStorage.getItem("autocompletion")) {
		$tableau = localStorage.getItem("autocompletion").split(",");
		for (var i = 0; i < $tableau.length; i++) {
			autocompletion.push($tableau[i]);
		}
	}
}


function recherche_nouvelles()
{
	trouve = 0;
	recherche_courante_news = [];
	recherche_courante = $zone_saisie.val();

	// Recherche de la "recherche_courante" dans le tableau "autocompletion"
	for (var i = 0; i < autocompletion.length; i++) {
		if(autocompletion[i] == recherche_courante){
			trouve++;
		}
	}

	// Si la recherche_courante ne se trouve pas dans le tableau "autocompletion" alors on l'ajoute
	if (trouve==0) {
		autocompletion.push(recherche_courante);
	}

	localStorage.setItem("autocompletion",autocompletion);
	// $.cookie("autocompletion", autocompletion);

	// if (!!$.cookie(recherche_courante)) {
	if (localStorage.getItem(recherche_courante)) {
		// recherche_courante_news = JSON.parse($.cookie(recherche_courante));
		recherche_courante_news = JSON.parse(localStorage.getItem(recherche_courante));
		console.log(recherche_courante_news);
	}
	$("#resultats").children('p').each(function(){	//Suppression de toutes les divs de #resultats
		this.remove();
	});
	$("#wait").css("display", "block");
	// Appel ajax de type GET avec le paramètre data ayant la valeur correspondant au contenu de la zone de saisie et avec une callback nommée maj_resultats
	resultat = $.get("search.php",
								{
									data: $zone_saisie.val()
								},
								function maj_resultats(res){
									$("#wait").css("display", "none");
									$res = $.parseJSON(res);
									for (var i = 0; i < $res.length; i++) {
										$res[i].date = format($res[i].date);
										$res[i].titre = decodeEntities($res[i].titre);
										if (indexOf(recherche_courante_news, $res[i])!=-1) {
											var new_result = $('<p class="titre_result"><a class="titre_news" href="'+$res[i].url+'" target="_blank">'+$res[i].titre+'</a><span class="date_news">'+$res[i].date+'</span><span class="action_news" onclick="supprime_news(this)"><img src="disk15.jpg"/></span></p>');
										}else{
											var new_result = $('<p class="titre_result"><a class="titre_news" href="'+$res[i].url+'" target="_blank">'+$res[i].titre+'</a><span class="date_news">'+$res[i].date+'</span><span class="action_news" onclick="sauve_news(this)"><img src="horloge15.jpg"/></span></p>');
										}
										$("#resultats").append(new_result);
									}
								});
}


function sauve_news(e)
{
	$(e).children('img').attr("src","disk15.jpg");	//Change l'image de l'horloge par une disquette
	$(e).attr("onclick", "supprime_news(this)");	//Change l'attribut onclick

	//Récupération du titre, de la date et de l'url de la recherche
	titre = $(e).parent().children(".titre_news").text();
	date = $(e).parent().children(".date_news").text();
	url = $(e).parent().children(".titre_news").attr("href");

	//Création d'un objet
	$object = {titre, date, url};
	if (indexOf(recherche_courante_news, $object)==-1) {
		recherche_courante_news.push($object);
	}
	localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
	// $.cookie(recherche_courante,JSON.stringify(recherche_courante_news), {expires : 1000});
}


function supprime_news(e)
{
	$(e).children('img').attr("src","horloge15.jpg");	//Change l'image de l'horloge par une disquette
	$(e).attr("onclick", "sauve_news(this)");	//Change l'attribut onclick

	//Récupération du titre, de la date et de l'url de la recherche
	titre = $(e).parent().children(".titre_news").text();
	date = $(e).parent().children(".date_news").text();
	url = $(e).parent().children(".titre_news").attr("href");

	//Création d'un objet
	$object = {titre, date, url};
	if (indexOf(recherche_courante_news, $object)!=-1) {
		recherche_courante_news.splice(indexOf(recherche_courante_news,$object),1);
	}
	localStorage.setItem(recherche_courante,JSON.stringify(recherche_courante_news));
	// $.cookie(recherche_courante,JSON.stringify(recherche_courante_news),{expires : 1000});
}
