// Astro Framework - Wordpress verison 0.1.1
// Copyright 2015 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: October 13th, 2015
//
// Support:
//  Wordpress.com, the official RESTful api endpoint
//  Wordpress.org (self hosted) with Jetpack json api plugin 
//
// Hightlight:
// 1. rewrit the list render, ul and li will remove
var ASTRO = (function (ASTRO) { 'use strict';

if (ASTRO.core === undefined) {
    ASTRO.core = {};
}
var module = ASTRO.core;

/**
 * Layout attribute name
 * @type {string}
 */
var ASTRO_LAYOUT = "astro-layout";

/**
 * Basic error object for internal error handling
 *
 * @param message thrown error message
 * @constructor
 */
var AstroError = function(message) {
    this.message = "ASTRO error: " + message;
    this.errorNode = document.createElement("span");
    this.errorNode.innerText = this.message;
};

/**
 * Base layout object
 *
 * @param parent DOM root to populate with layout content
 * @param layout layout content string
 * @constructor
 */
var AstroLayout = function(parent, layout) {
    this.parent = parent;
    this.layout = layout;
};

/**
 * Inject the layout into the DOM
 */
AstroLayout.prototype.generate = function() {
    var el;
    if (document.createRange) {
        var range = document.createRange();
        range.selectNode(this.parent);
        el = range.createContextualFragment(this.layout);
    } else {
        // TODO: account for IE innerHTML bugs (use jQuery?)
        el = document.createElement('div');
        el.innerHTML = this.layout;
    }
    this.parent.appendChild(el);
};

/**
 * Layout type object
 *
 * @type {Object}
 */
var Layout = {
    article: ''
    + '<article>'
    + '  <header>'
    + '    <h1 data-wp-template="title"></h1>'
    + '  </header>'
    + '  <img data-wp-template="featured_image">'
    + '  <p data-wp-template="content"></p>'
    + '</article>'
};

/**
 * Given a DOM element with an astro-layout attribute,
 * fetch its contents and append them to the DOM
 *
 * @param parent DOM element with an astro-layout attribute
 */
module.buildLayout = function(parent) {
    try {
        var type = parent.getAttribute(ASTRO_LAYOUT).toLowerCase(),
            layout = new AstroLayout(parent, Layout[type]);
        layout.generate();
    } catch (e) {
        if (e instanceof AstroError) {
            console.error(e.message);
            // Insert error node into the DOM
            parent.parentNode.insertBefore(e.errorNode, parent.nextSibling);
        } else {
            console.error(e);
        }
    }
};

module.RootElement = function(domBlock) {
    var url, root;
    var root = domBlock;
    url = root.dataset.wpSource;
    function validateSource (url) {
        return (url.search(/wordpress/) != -1);
    }

    function getSourceURL () {
        // root should expect
        if (root.dataset.wpSource.slice(-1) !== "/") {
            return root.dataset.wpSource + "/";
        } else {
            return root.dataset.wpSource;
        }
    }

    function findWPElements () {
        return root.querySelectorAll("[data-wp-element]");
    }


    function findWPCollections () {
        return root.querySelectorAll("[data-wp-collection]");
    }

    function countElements () {
        return root.querySelectorAll("[data-wp-element]").length;
    }

    function countCollections () {
        return root.querySelectorAll("[data-wp-collection]").length;
    }

    // public properties
    return {
        getSourceURL: getSourceURL,
        findWPElements: findWPElements,
        findWPCollections: findWPCollections,
        countElements: countElements,
        countCollections: countCollections
    };
};

module.WPCollections = function(domEl) {
    var element, expectedType;
    expectedType = ["posts", "categories"];

    element = domEl;

    function getSearchCriteria(element) {
        var criteria, data;
        criteria = {};
        if(!element) {
            return;
        }
        // get the dataset
        data = element.dataset;
        if (data.wpCollection) {
            criteria.type = data.wpCollection;
        }
        if (data.wpOptions) {
            criteria.option = data.wpOptions;
        }
        if (expectedType.indexOf(criteria.type) === -1) {
            console.error("ASTRO Error: data-wp-element only "
                        + "support posts and category");
            return null;
        }
        return criteria;
    }

    function requestUrl (sourceUrl) {
        // build the request url
        var component = getSearchCriteria(element);
        var url;
        if (component.hasOwnProperty("type")) {
            url = "";
            url += sourceUrl + component.type + "/";
            if (!component.hasOwnProperty("option")) {
                return url;
            } else {
                // if contains wp-option
                url += "?" + component.option;
            }
        } else {
            // this may not happen if no type
        }
        return url;
    }

    function self () {
        return element;
    }

    function template () {
        return element.querySelector("[data-wp-layout]");
    }


    // public properties
    return {
        requestUrl: requestUrl,
        self: self,
        template: template
    }
};

module.WPElement = function(domEl) {
    var element, expectedType;
    expectedType = ["posts", "categories"];

    element = domEl;
    function getSearchCriteria (element) {
        var criteria, data, index;
        if (!element) {
            return;
        }
        criteria = {};
        data = element.dataset;
        index = data.wpElement.indexOf("/");
        if (index !== -1) {
            criteria.itemId = data.wpElement.slice(index + 1);
            criteria.type = data.wpElement.slice(0, index);
        } else {
            criteria.type = data.wpElement;
        }

        if (data.wpOptions) {
            criteria.options = data.wpOptions;
        }

        if (expectedType.indexOf(criteria.type) === -1) {
            console.error("data-wp-element only support posts");
            return null;
        }
        return criteria;
    }
    function processUrl (url) {
        if(url.slice(-1) !== "/") {
            return url + "/";
        } else {
            return url;
        }

    }

    function requestUrl (sourceUrl) {
         var component = getSearchCriteria(element);
        if (component){
            var url = '';
            url += processUrl(sourceUrl);
            if (component.itemId) {
                url += component.type + "/" + component.itemId + "/";
                if (component.options) {
                    url+= "?" + component.options;
                }
            } else {
                url += component.type + "/";
                if (component.options) {
                    url+= "?" + component.options;
                }
            }
            return url;
        } else {
            return null;
        }
    }

    function self () {
        return element;
    }


    // public properties
    return {
        requestUrl: requestUrl,
        self: self
    }
};

module.util = {
    ajax: function (url, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // JSON.parse will crash when has unexpected response 'json'
                callback(null, JSON.parse(xmlhttp.responseText));
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },
    insertContent: function (json, template) {
        // json = {post}
        // insert each element with class = "post" + json["ID"]
        for (var i = 0; i < template.length; i++) {
            if (template[i].tagName === "IMG") {
                template[i].setAttribute("src",
                    json[template[i].dataset.wpTemplate]);
            } else if (template[i].tagName === "A") {
                template[i].setAttribute("href",
                    json[template[i].dataset.wpTemplate]);
            } else {
                template[i].innerHTML = json[template[i].dataset.wpTemplate];
            }
        }
    },
    insertCollections: function (json, layout) {
        // json = [{post}, {posts} ..]
        var list = layout.querySelector("*");
        json.posts.forEach(function (post, index) {
            if (index == 0) {
                // this not need to clone
                ASTRO.core.util.insertContent(post,
                    layout.querySelectorAll("[data-wp-template]"));
            } else {// this need to clone
                var virtual = list.cloneNode(true);
                ASTRO.core.util.insertContent(post,
                    virtual.querySelectorAll("[data-wp-template]"));
                layout.appendChild(virtual);
            }
        });
    },
    insertError: function (json, template) {
        // TODO:
        // insert error message into the dom,
        // it helps developer to know what went wrong
        //
        // <img data-wp-template>
        //     <span>Astro-ERROR: Can not fetch image</span>
        // </img>
    }

};

module.buildNode = function(node) {
    var root, wpElementTag,wpCollectionTag, wpElements, baseUrl,
        wpCollection, layoutElements;
    // Select all elements with layout attributes within the parent block
    layoutElements = node.querySelectorAll("[" + ASTRO_LAYOUT +  "]");

    root = ASTRO.core.RootElement(node); // create ROOT object
    wpElementTag = root.findWPElements();
    wpCollectionTag = root.findWPCollections();
    wpElements = [];
    wpCollection = [];
    baseUrl = root.getSourceURL();
    for (var i = 0; i < wpElementTag.length; i++) {
        wpElements.push(ASTRO.core.WPElement(wpElementTag[i]));
    }

    for (var j = 0; j < wpCollectionTag.length; j++) {
        wpCollection.push(ASTRO.core.WPCollections(wpCollectionTag[j]));
    }

    for (var k = 0; k < layoutElements.length; k++) {
        ASTRO.core.buildLayout(layoutElements[k]);
    }
    wpElements.forEach(function(el, index) {
        var template = el.self().querySelectorAll("[data-wp-template]");
        ASTRO.core.util.ajax(el.requestUrl(baseUrl), function(err, data) {
            // if expecting data = {post}
            // this will break if the data in unexepeted format
            // Only reder first post if exist of not
            if (!data.hasOwnProperty('posts') ){
                ASTRO.core.util.insertContent(data, template);
            } else {
                // only display the 1st post when doing search
                // use data-wp-options="category=demo"
                // it can be display the most recent post under demo
                ASTRO.core.util.insertContent(data.posts[0], template);
            }
        });
    });

    wpCollection.forEach(function (col, index) {
        ASTRO.core.util.ajax(col.requestUrl(baseUrl), function(err, data) {
            ASTRO.core.util.insertCollections(data, col.template());
        });
    });
};

function ASTROWP() {
    var parent;
    // find the source, key to fetch content from more 1 wordpress site
    parent = document.querySelectorAll("[data-wp-source]");
    // querySelectorAll return NodeList, not array
    // foreach doesn't work in this case
    for (var i = 0; i < parent.length; i++) {
        ASTRO.core.buildNode(parent[i]);
    }
}

ASTROWP();
return ASTRO;
})(ASTRO || {});
