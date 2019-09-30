
var qui = [];
var qui_ok = false;

Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}
    
Date.prototype.french = function () {
    n=this.getDate();
    d=this.getDay();
    dlist=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
    return dlist[d]+" "+n+" "+this.frenchmonth();
}

Date.prototype.frenchmonth = function () { 
    y=this.getFullYear();
    m=this.getMonth();
    mlist=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    return mlist[m]+" "+y;
}
    
var parse = function(data)
{
    var column_length = data.table.cols.length;
    if (!column_length || !data.table.rows.length)
    {
        return false;
    }
    var columns = [],
        result = [],
        row_length,
        value;
    for (var column_idx in data.table.cols)
    {
        columns.push(data.table.cols[column_idx].label);
    }
    for (var rows_idx in data.table.rows)
    {
        row_length = data.table.rows[rows_idx]['c'].length;
        if (column_length != row_length)
        {
            // Houston, we have a problem!
            return false;
        }
        for (var row_idx in data.table.rows[rows_idx]['c'])
        {
            if (!result[rows_idx])
            {
                result[rows_idx] = {};
            }
            value = null; 
            if ( !! data.table.rows[rows_idx]['c'][row_idx] ) {
              if ( !! data.table.rows[rows_idx]['c'][row_idx].f )
                value = data.table.rows[rows_idx]['c'][row_idx].f ;
              else if ( !! data.table.rows[rows_idx]['c'][row_idx].v )
                value = data.table.rows[rows_idx]['c'][row_idx].v ;
            }
            result[rows_idx][columns[row_idx]] = value;
        }
    }
    return result;
};

var jsonp = function(url)
{
    var script = window.document.createElement('script');
    script.async = true;
    script.src = url;
    script.onerror = function()
    {
        alert('Impossible d\'accéder à la base des données. Réessayez ultérieurement SVP.')
    };
    var done = false;
    script.onload = script.onreadystatechange = function()
    {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'))
        {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (script.parentNode)
            {
                return script.parentNode.removeChild(script);
            }
        }
    };
    window.document.getElementsByTagName('head')[0].appendChild(script);
};

var query = function(sql, sh, callback)
{
    var url = 'https://spreadsheets.google.com/a/google.com/tq?',
        params = {
            key: '1k7unaV0wi5-X8Q0P5J4b9Q-X-nVClnQ-SGdjIV8m4NQ',
            sheet: sh,
            tq: encodeURIComponent(sql),
            tqx: 'responseHandler:' + callback
        },
        qs = [];
    for (var key in params)
    {
        qs.push(key + '=' + params[key]);
    }
    url += qs.join('&');
    //console.log(url);
    return jsonp(url); // Call JSONP helper function
}

var medaille = function(rang) {
  s = "<td";
  if ( rang != "" ) {
    if ( rang < 4 ) s += ' class=medaille><img class=medaille src="'+rang+'.png" alt='+rang+' ></img>';
    else s += '>'+rang;
  }
  else s += '>&nbsp;';
  return s;
}

var list_res = function(data)
{
	d = parse(data);
    j=0;
    while ( qui_ok != true && j<10) { 
        setTimeout(donothing,500);
        j++;
    }
    if ( j==10 ) alert ("Problème avec la base des athlètes");
    id="";
	$.each(d, function(i,item) {
        if ( !i ) { // on supprime l'info de recherche des résultats...
            $("#res_"+item["IDCompet"]).children().first().children().last().remove(); 
            id=item["IDCompet"];
        }
		l=$("<tr>");
        q=qui[item["IDAthlete"]];   
        if (q.Equipe == "Oui") l.attr('eqid',q.ID)
        t=$("<td class=t_nomcomplet colspan=2>").text(q.Nom);
        l.append(t);
        cat = ((!!item["Cat"])?item["Cat"]:"")+q.Sexe+((!!item["SubCat"])?item["SubCat"]:"");
        tps = (!!item["Temps"])?item["Temps"]:"";
        cscr = (!!item["ClassScratch"])?item["ClassScratch"]:"";
        nscr = (!!item["NbScratch"])?item["NbScratch"]:"";
        scr_td = medaille(cscr)+((nscr!="")?" / "+nscr:"")+"</td>";
        ccat = (!!item["ClassCat"])?item["ClassCat"]:"";
        ncat = (!!item["NbCat"])?item["NbCat"]:"";
        cc_td = medaille(ccat)+((ncat!="")?" / "+ncat:"")+"</td>";
        //console.log(scr_td);
        l.append($("<td>").text(cat));
        l.append($("<td>").text(tps));
        l.append(scr_td);
        l.append(cc_td);
		$("#res_"+item["IDCompet"]).children().append(l);
	});
    l=$("<tr class=chapeau>").append("<td colspan=6 class=t_url>&nbsp;</td>");
    $("#res_"+id).children().append(l); 
		// Maintenant, on remplit le nom des équipes
    setTimeout(function(){
		$("#res_"+id+" tr[eqid]").each( function(i,item) {
        eqid=$(item).attr('eqid');
        //console.log('eqid A = '+eqid);
        liste_equipe = function(data) {
            eq=data.table.rows[0].c;
            eqid=(eq[1].v);
            toute_equipe="";
            $.each(eq, function(j,q) {
                if ( j>1 ) if ( !!q ) if ( !!q.v ) toute_equipe+=qui[q.v].Nom+"<br/>";
            });
            champ=$("#res_"+id+" tr[eqid="+eqid+"] td.t_nomcomplet").first();
            champ.attr('colspan','1');
            champ.text('Équipe :');
            champ.attr('class','t_nom1');
            champ.after('<td class=t_nom2>'+toute_equipe+'</td>');
            
        }
        query('select A,B,C,D,E,F,G,H,I where A="'+id+'" and B="'+eqid+'"','%C3%89quipes','liste_equipe');
    }); }, 1000); // attente de 1 s pour les equipes, il faudrait un ready() quelque part...
}

var list_compet = function(data) {
    d = parse(data);
    quand="";
    first_ids=[];
    $.each(d, function(i,item) {
        if ( !i ) {
	  $("#compet").children().last().remove();
	}
      	if ( i < 2 ) first_ids.push(item["ID"]);
	l=$("<li>").text(item["Nom"]);
        dd=new Date(item['year(Date)'],item['month(Date)'],item['day(Date)']);
        maintenant = dd.frenchmonth();
        if ( quand != maintenant ) {
            l2 = $("<li>").text(maintenant);
            l2.addClass('quand');
            $("#compet").append(l2);
            quand = maintenant;
        } 
        ddf=dd.french();
        l.append("<span class=ouvert> — "+ddf+"</span>");
        l.attr('id',item["ID"]);
        l.attr('class','non');  // non invis ou oui 
	t=$("<table class=ferme>"); t.attr('id',"res_"+item["ID"]);t.addClass('ferme');
	img='';
    if ( !! item["UrlImage"] ) {
        img='<tr class=chapeau><td colspan=6 class=t_img><img class=photo src="'+item["UrlImage"]+'" alt="photo : '+item["Nom"]+'"></img></td></tr>';
    }
    t.append("<tr><td colspan=6 class=t_date>"+ddf+" à "+item["Lieu"]+"</td></tr>"
        +img
        +"<tr class=chapeau><td colspan=6 class=t_url>Visiter : <a href=\""+item["Url"]+"\" target=\"_blank\">le site web de l'épreuve</a>"
        +((!!item["UrlResultats"])?" ou <a href=\""+item["UrlResultats"]+"\" target=\"_blank\">les résultats</a>":"")
	    +".</td></tr>"
        +"<tr class=chapeau><th colspan=2 class=t_nomcomplet>Nom de l'athlète</th>"
        +"<th class=t_cat>Cat</th>"
        +"<th class=t_tps>Temps</th>"
        +"<th class=t_scratch>Scratch</th>"
        +"<th class=t_parcat>Par cat</th></tr>");
    l.append(t);
    $("#compet").append(l);
	});
	
	$('li').click( function( event ) {
		//event.preventDefault();
        id = $(this).attr('id');
		etat=$(this).attr('class');
        if(etat != 'quand') {
        if(etat == 'oui') {
            $(this).attr('class','invis');
            $(this).children().filter($("table")).attr('class','ferme');
            $(this).children().filter($("span")).attr('class','ouvert');
        }
        else {
            if ( etat == 'non' ) {
                $(this).children().filter($("table")).append("<tr><td colspan=6>Recherche des résultats...</td></tr>");
                query('select A,B,C,D,E,F,G,H,I where A=\''+id+'\'','Res','list_res');
            }
            $(this).attr('class','oui');
            $(this).children().filter($("table")).attr('class','ouvert');
            $(this).children().filter($("span")).attr('class','ferme');
        }
        }
	});

	$.each(first_ids, function(i,x) {
	  $("li#"+x).click();	
	});
}

var list_athlete = function(data) {
    d = parse(data);
    $.each(d, function(i,item) {
        qui[item["ID"]] = {
            ID:item["ID"], 
            Nom:item["Prénom"]+((!!item["Nom"])?" "+item["Nom"]:""), 
            Sexe:item["Sexe"], 
            Equipe:((!!item["Equipe"])?item["Equipe"]:"Non")
        };
    });
    qui_ok = true;
}

var remplitCompet = function() {
  query('select A,year(B),month(B),day(B),C,D,I,K,L where B>=date \'2017-01-01\' and J=\'Oui\' order by B desc, F desc, G desc', 'Compet','list_compet');
  query('select A,B,C,F,K','Athlete','list_athlete');
}
