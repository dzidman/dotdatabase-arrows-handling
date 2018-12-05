// ==UserScript==
// @name         Arrow handling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add arrow handling to dotadatabase.net
// @author       Dzidman
// @match        https://dotdatabase.net/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var relicIndex = -1;

    // add action to links in relic list
    waitUtilExistsById("RELIC_LIST", addOnClickAction);
    function waitUtilExistsById(id, worker){
        var checkExist = setInterval(function() {
            var element = document.getElementById(id)
            if (element != undefined) {
                clearInterval(checkExist);
                worker(element)
            }
        }, 100);
    }
    function addOnClickAction(relicList){
        var links = relicList.querySelectorAll("li a:first-child")
        links.forEach(function(item){
            item.addEventListener("click", setCurrentRelicIndex)
        })
    }

    // set current relic index
    function setCurrentRelicIndex(e){
        var srcElement = e.srcElement;
        var i;
        var links = getRelicLinks()
        for (i = 0; i < links.length; i++) {
            if (links[i] == srcElement){
                relicIndex = i;
            }
        }
    }

    // handle pressing arrows
    document.body.addEventListener("keydown", checkKey)
    function checkKey(e) {
        e = e || window.event;
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) < 0){
            return
        }

        e.preventDefault();
        if (e.keyCode == '38') {
            // up arrow - previous relic
            previousRelic()
        }
        else if (e.keyCode == '40') {
            // down arrow - next relic
             nextRelic()
        }else if (e.keyCode == '37' || e.keyCode == '39') {
            // add/remove from collecton
            addToCollection()
        }
    }

    function previousRelic(){
        if (relicIndex > 0){
            relicIndex--;
            openRelic()
        }
    }

    function nextRelic(){
        var reliclinks = getRelicLinks()
        if (relicIndex < reliclinks.length){
            relicIndex++;
            openRelic()
        }
    }

    function getRelicLinks(){
        return document.getElementById("RELIC_LIST").querySelectorAll("li a:first-child")
    }

    // open relic
    function openRelic(){
        var links = getRelicLinks()
        links.forEach(function(item){
            item.style.backgroundColor="";
        });
        var relicLink = links[relicIndex]
        relicLink.style.backgroundColor = "white";
        relicLink.click()
        var relicContainer = document.getElementById("RELIC_LIST_CONTAINER")
        var scrollTop = relicLink.offsetTop - relicContainer.offsetTop - relicLink.offsetHeight * 3
        relicContainer.scrollTop = scrollTop
    }
    //add to collection
    function addToCollection(){
        var relicLink = getRelicLinks()[relicIndex]
        relicLink.nextElementSibling.nextElementSibling.nextElementSibling.click()
    }

})();
