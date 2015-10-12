describe("Test collection", function () {
    var dom;
    var domElement="";
        domElement += "<div data-wp-source='https://public-api.wordpress.com/rest/v1.1/sites/98941271/'>";
        domElement += "    <div data-wp-collection='posts' data-wp-options='category=Uncategorized&number=2'>";
        domElement += "        <ul data-wp-layout='list'>";
        domElement += "            <li><h1 data-wp-template='title'></h1></li>";
        domElement += "        </ul>";
        domElement += "    </div>";
        domElement += "</div>";

        dom = document.createElement('div');
        dom.innerHTML = domElement;
    it ("should contain 1 collection", function (){
        var root, parent;
        root = dom.querySelector("[data-wp-source]"); 
        parent = ASTRO.core.RootElement(root);
        expect(parent.countCollections()).toBe(1);
    }); 
    it ("should return request url", function () {
        var root, parent, child, collection;
        root = dom.querySelector("[data-wp-source]");
        parent = ASTRO.core.RootElement(root);
        child = root.querySelector("[data-wp-collection]");
        collection = ASTRO.core.WPCollections(child);
        expect(collection.requestUrl(parent.getSourceURL())).toBe("https://public-api.wordpress.com/rest/v1.1/sites/98941271/posts/?category=Uncategorized&number=2");
    }); 
    
    it ("should able to build list", function () {
        var root, parent, child, collection;
        root = dom.querySelector("[data-wp-source]");
        parent = ASTRO.core.RootElement(root);
        child = root.querySelector("[data-wp-collection]");
        collection = ASTRO.core.WPCollections(child);
        collection.template();

    });
});
