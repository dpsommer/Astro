Astro
=====

[![Join the chat at https://gitter.im/Ting-y/Astro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Ting-y/Astro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A JavaScript framework to render JSON content, regardless skill level.

Astro renders JSON in a simple way. Using only data attributes in the HTML markup, renders publicly available JSON content that does not require authentication from WordPress.com or WordPress.org websites using Jetpack's REST JSON API or WP-API Version 2.0. See it in action: [Astro home page](http://getastro.github.io/Astro).


**Hightlights:**
* Fetch from a single API source or from multiple API sources in the same document
* Fetch a single page, single post, or a latest post (category is optional)
* Fetch collections (category and number of posts are optional)
* Templating parameters (title, content, featured image, etcetera)

###Getting Started
___
Download the js from [version 0.3.1](https://github.com/getastro/Astro/releases/tag/0.3.1)

######CDN
https://cdn.jsdelivr.net/astro/0.3.1/astro-api.min.js

#####Include it into your html

Include astro file inside body tag and before any Javascript execuetion block
```javascript
<!DOCTYPE html>
<body>

<script src="https://cdn.jsdelivr.net/astro/0.3.1/astro-api.min.js"></script>
</body>
</html>
```

####Create a template to render json content

**Examples**

* [Display a specific post](https://github.com/Ting-y/Astro/blob/master/examples/example1-display-single-post.html)
* [Display a list of post](https://github.com/Ting-y/Astro/blob/master/examples/example2-display-collections.html)
* [Display the most recent post in the category](https://github.com/Ting-y/Astro/blob/master/examples/example3-display-most-recently-post.html)

####Data attributes

**Summary**

| Data Attribute      | Required |Description                            |
|---------------------|----------|---------------------------------------|
| data-api-host       | Yes      | To identify the content source
| data-api-endpoint   | Yes      | end point from API |
| data-api-property   | Yes      | The return field you want to display|
| data-api-parameters | When using query parameter     | RESTful API qury parameters            |
| data-api-template   | When displaying collection     | This is required if rendering multiple posts |

[Data attributes usage detail & example](https://github.com/Ting-y/Astro/wiki/Data-attributes-usage-and-explanation)

###Support:

-  blog on wordpress.com
-  self hosted(wordpress.org) with jetpack json-api plugin enabled
-  self hosted(wordpress.org) with WP-API version 2 enabled


###Todo:
- Fix Unit tests
- Accessibility

###Reference:
WordPress official RESTful API endpoint
[Documentaion](https://developer.wordpress.com/docs/api/)
WP-API Version 2.0 endpoint
[Documentaion](http://v2.wp-api.org/)

###Questions:
If you have any questions about Astro, please [create a new issue](https://github.com/Ting-y/Astro/issues) or Email [Ting](mailto:ting.yatingyang@gmail.com)
