var recherches=[];//tableau contenant des chaines de caracteres correspondant aux recherches stockees
var recherche_courante;// chaine de caracteres correspondant a la recherche courante
var $zone_saisie = $("#zone_saisie");
var recherche_courante_news=[]; // tableau d'objets de type resultats (avec titre, date et url)

function ajouter_recherche()
{
	if (recherches.indexOf($zone_saisie.val())==-1){
			recherches.push($zone_saisie.val());
			var new_recherche = $('<p class="titre-recherche"><label>'+$zone_saisie.val()+'</label><img src="croix30.jpg" class="icone-croix"/> </p>');
			$("#recherches-stockees").append(new_recherche);
			$("#recherches-stockees label").attr("onClick","selectionner_recherche(this)");
			$("#recherches-stockees img").attr("onClick","supprimer_recherche(this)");
	}
	// myObj= '{"recherches":['
	// 	for (var i = 0; i < recherches.length-1; i++) {
	// 			myObj=myObj+'{"id":"'+i+'","val":"'+recherches[i]+'"},';
	// 	}
	// 	myObj+='{"id":"'+recherches.length-1+'","val":"'+recherches[recherches.length-1]+'"}]}';
	// 	$.cookie.json = true;hh
	$.cookie("recherches",JSON.stringify(recherches));
	alert($.cookie("recherches"));
}

function supprimer_recherche(e)
{
	$parent = $(e).parent();
	recherches.splice(recherches.indexOf($parent.children("label").text()),1);
	$parent.remove();
	$.cookie("recherches",JSON.stringify(recherches));
	alert($.cookie("recherches"));
}


function selectionner_recherche(e)
{
		valeur = $(e).text();
		$zone_saisie.val(valeur);
		recherche_courante = valeur;
}


function init()
{
	// Si un cookie "recherches" existe alors on initialise recherches avec le contenu du cookie
	if (!!$.cookie("recherches")) {
		var $content_cookie = JSON.parse($.cookie("recherches"));	//Array du contenu du cookie
		for (var i = 0; i < $content_cookie.length; i++) {	//Ajout du contenu
			recherches.push($content_cookie[i]);
			var new_recherche = $('<p class="titre-recherche"><label>'+recherches[i]+'</label><img src="croix30.jpg" class="icone-croix"/> </p>');
			$("#recherches-stockees").append(new_recherche);
			$("#recherches-stockees label").attr("onClick","selectionner_recherche(this)");
			$("#recherches-stockees img").attr("onClick","supprimer_recherche(this)");
		}
	}
}


function recherche_nouvelles()
{
	$("#resultats").children().each(function(){	//Suppression de toutes les divs de #resultats
		this.remove;
	})
	$("#wait").attr("display", "block");
	// Appel ajax de type GET avec le paramètre data ayant la valeur correspondant au contenu de la zone de saisie et avec une callback nommée maj_resultats
	resultat = $.get("search.php",
	{
		data: $zone_saisie.val()
	},
	maj_resultats());
	console.log(resultat);
}


function maj_resultats(res)
{
	$("#wait").attr("display", "none");
}


function sauve_news(e)
{

}


function supprime_news(e)
{

}
