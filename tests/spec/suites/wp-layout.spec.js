describe("Test single post layout", function () {
    var dom;
    var domElement='';
    domElement += '<div data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/ncdsbcdn.wordpress.com/">';
    domElement += '  <div data-wp-element="posts" data-wp-options="category=Uncategorized" astro-layout="article"></div>';
    domElement += '</div>';

    dom = document.createElement('div');
    dom.innerHTML = domElement;

    it ("should create a layout for the post", function (){
        var root;
        root = dom.querySelector("[data-wp-source]");
        ASTRO.core.buildNode(root);
        expect(root.getElementsByTagName("article").length).toBe(1);
    });
});

describe("Test collection layout", function () {
    var dom;
    var domElement='';
    domElement += '<div data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">';
    domElement += '  <div data-wp-collection="posts" data-wp-options="number=2">';
    domElement += '    <ul data-wp-layout="list">';
    domElement += '      <li astro-layout="article"></li>';
    domElement += '    </ul>';
    domElement += '  </div>';
    domElement += '</div>';

    dom = document.createElement('div');
    dom.innerHTML = domElement;

    it ("should inject multiple layouts for the collection", function (){
        var root, parent, child, collection, layoutNodes;
        root = dom.querySelector("[data-wp-source]");
        ASTRO.core.buildNode(root);
        var els = root.getElementsByTagName("article");
        console.log(els);  // FIXME: this case is very strange...
                           // the logged array has 2 elements, but a call to length returns 1
        expect(els.length).toBe(2);
    });
});