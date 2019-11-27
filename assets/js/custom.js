var allNews = [];
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    fetchNews();
    //CSS CLASSES SETUP: based on device
    var mql = window.matchMedia('(max-width: 699px)');
    if (mql.matches) {
        document.querySelector('#indus_cont').classList.remove("indus_middle");;
    }
    mql = window.matchMedia('(max-width:339px)');
    if (mql.matches) {
        document.querySelector('#indus_cont_five').classList.add("indus_middle_five");;
    }
    mql = window.matchMedia('(max-width: 399px)');
    if (mql.matches) {
        var sel = '#all_news';
        var coll = document.querySelector(sel).classList.add('lessthan400');

    } else {
        var sel = '#all_news';
        var coll = document.querySelector(sel).classList.add('morethan400');
    }
});

// APPEND SITEPLUG SCRIPT
let sitePlugFragment = document.createElement('script');
sitePlugFragment.src = "https://kme46.siteplug.com/qlapi?o=kme46&s=88107&u=[domain]&f=json&n=8&i=1&is=36x36&di=&callback=fetchRecommends";
document.body.appendChild(sitePlugFragment);

// RECOMMENDED APPS
function fetchRecommends(res) {
    if (typeof res == 'string') {
        let res = JSON.parse(res);
    }
    let data = res['data'];

    let recommended_app_section_node = document.getElementById('recommended_app_section');
    let recFragment = new DocumentFragment();

    for (let i = 0; i < data.length; i++) {
        let news_node = document.createElement('div');
        news_node.classList.add('col-xs-3');
        news_node.classList.add('panel');
        news_node.classList.add('fig_div');
        news_node.id = `fig_div_${i}`;
        let img_src = data[i]['iurl'].replace('36x36', '128x128');

        let single_item = `<div class="panel-body">
                <a id="app_url_${i}" href="${data[i]['rurl']}">
                    <img class="img-responsive img-thumbnail center-block recommended_apps"
                        id="app_image_${i}" src="${img_src}" alt="${data[i]['brand']}"
                        data-name="${data[i]['brand']}">
                    <span class="panel-heading word-wrap recommended_apps_name"
                        id="recommended_apps_name_${i}">${data[i]['brand']}
                    </span>
                </a>
            </div>`;

        news_node.innerHTML = single_item;
        recFragment.appendChild(news_node);
    }

    // attach recFragment to main DOM
    recommended_app_section_node.appendChild(recFragment);
    mql = window.matchMedia('(max-width: 320px)');
    if (mql.matches) {
        var icoColl = document.querySelectorAll('.fig_div:nth-last-child(-n+4)');
        for (var i = 0; i < icoColl.length; i++) {
            icoColl[i].classList.add('fourinch');
        }
        var nextdiv = document.createElement("a");
        nextdiv.id = 'change_arrowicon'
        //nextdiv.className = 'glyph-icon flaticon-down-arrow';

        var arrImg = document.createElement("img");
        arrImg.id = 'arrow_img';
        arrImg.src = 'assets/images/down-arrow-sc.svg';
        nextdiv.appendChild(arrImg);

        nextdiv.href = "javascript:show_nextitem();"

        document.getElementById('recommended_app_section').appendChild(nextdiv);
    }
    flag_var = 1;
}

// FETCH NEWS
const fetchNews = async (query) => {
    console.log('fetching the news......');
    let pageNumber = 1;
    let newsAppKey = 'DVj2UsFaFnN+3kn4VHWPS9hUiLCz4eOtblRfAUrDC50=';
    let current_parameter = query;
    // let bigAdInterval = 2;
    // let smallAdInterval = 5;

    let timestamp = new Date().getTime();
    let message_get = "cid=1&fields=data.rows.id%2Cdata.rows.title%2Cdata.rows.deepLinkUrl%2Cdata.rows.publishTime%2Cdata.rows.images%2Cdata.rows.source%2Cdata.rows.sourceLogo&langCode=hi&pageNumber=" + pageNumber + "&pageSize=1&partner=indus&puid=" + current_parameter + "&ts=" + timestamp + "GET";
    let hash_get = CryptoJS.HmacSHA1(message_get, "4IGAIGGb8z1nOGzpBiSeQA==");
    let hashInBase64_get = CryptoJS.enc.Base64.stringify(hash_get);
    // let message_post = "partner=indus&puid=" + current_parameter + "&ts=" + timestamp + "POST"
    // let hash_post = CryptoJS.HmacSHA1(message_post, "4IGAIGGb8z1nOGzpBiSeQA==");
    // let hashInBase64_post = CryptoJS.enc.Base64.stringify(hash_post);

    // let track_data = {
    //     "viewedDate": timestamp,
    //     "stories": []
    // };

    let url = "https://feed.dailyhunt.in/api/v2/syndication/items?pageSize=1&fields=data.rows.id,data.rows.title,data.rows.deepLinkUrl,data.rows.publishTime,data.rows.images,data.rows.source,data.rows.sourceLogo&cid=1&langCode=hi&pageNumber=" + pageNumber + "&partner=indus&ts=" + timestamp + "&puid=" + current_parameter;

    await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': "key=" + newsAppKey,
            'Signature': hashInBase64_get
        }
    }).then(res => res.json())
        .then(res => {
            if (res.code === 200) {
                renderNews(res.data);
            }
            else renderNews(false);
        })
        .catch(err => console.log(err))
}

// RENDER NEWS TO THE DOM
const renderNews = data => {
    if (data && data.count > 0) {
        let newsFragment = new DocumentFragment();
        console.log("Creating news feed DOM....");

        data.rows = data.rows.sort((a,b) => { return b.publishTime - a.publishTime });
        data.rows.forEach((i, idx) => {
            let li = document.createElement('li');
            li.id = `top_news_${idx}`;

            let sourceImg = i.sourceLogo.replace(/{CMD}/g, "crop").replace(/{W}x{H}_{Q}/g, "25x25_60").replace(/{EXT}/g, "webp");
            sourceImg = sourceImg.replace('96x96_60', '20x20_60');

            if (idx === 0) {
                let imgSrc = i.images[0].replace(/{CMD}/g, "crop").replace(/{W}x{H}_{Q}/g, "700x400_80").replace(/{EXT}/g, "webp");

                li.innerHTML = `<div class="top_div">
                    <a id="news_href_0" href="${i.deepLinkUrl}">
                        <div class="col-xs-12" id="pic">
                            <img
                                id="news_image_0"
                                class="img-r-esponsive img-rounded img-auto"
                                src="${imgSrc}"
                                alt="${i.source}"
                            >
                        </div>
                        <div class="col-xs-12">
                            <div class="first_top_news">
                                <div class="top_news_pro">
                                    <img
                                        src="${sourceImg}"
                                        id="source_image_0"
                                        class="img-r-esponsive img-auto"
                                        alt="${i.source}"
                                    >
                                    <span class="source_name" id="source_name_0">${i.source}</span>
                                </div>
                                <b id="news_heading_0" class="bwrap">${i.title}</b>
                                <div class="source_image">
                                    <h6 id="publishTime_0" class="publishTime" data-publish-ts="${i.publishTime}">${timeSince(i.publishTime)}</h6>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
            } else {
                let imgSrc = i.images[0].replace(/{CMD}/g, "crop").replace(/{W}x{H}_{Q}/g, "150x150_90").replace(/{EXT}/g, "webp");

                li.innerHTML = `<div class="top_div">
                    <a id="news_href_${idx}" href="${i.deepLinkUrl}">
                        <div class="col-xs-9">
                            <div class="top_news_pro">
                                <img
                                    id="source_image_${idx}"
                                    class="top_mar"
                                    src="${sourceImg}"
                                    alt="${i.source}"
                                >
                                <span class="source_name" id="source_name_${idx}">${i.source}</span>
                            </div>
                            <b id="news_heading_${idx}" class="bwrap">${i.title}</b>
                            <div class="source_image">
                                <h6 id="publishTime_${idx}" class="publishTime" data-publish-ts="${i.publishTime}">${timeSince(i.publishTime)}</h6>
                            </div>
                        </div>
                        <div class="col-xs-3" id="pic">
                            <img
                                id="news_image_${idx}"
                                class="img-r-esponsive img-rounded img-auto feeds_right"
                                src="${imgSrc}"
                                alt="${i.source}"
                            >
                        </div>
                    </a>
                </div>`;
            }
            newsFragment.appendChild(li);
        })

        document.getElementById('all_news').appendChild(newsFragment);
        googleAds();
    } else {
        console.log('Problem fetching the data.')
    }
}

// SEARCH BAR
let search_dom_node = document.getElementById('search_in_page');

search_dom_node.addEventListener('keyup', e => {
    let validInput = e.target.value.length > 2;

    if (validInput && (e.keyCode >= 65 && e.keyCode <= 122)) {
        searchFunc(e.target.value);
    } else if (validInput && e.keyCode === 13) {
        document.querySelector('.site_suggest_ads').innerHTML = '';
        redirectFunc(e.target.value);
    } else if (validInput) {
        document.querySelector('.site_suggest_ads').innerHTML = '';
    }
});

document.getElementById('button-icon').addEventListener('click', () => {
    if (search_dom_node.value.length > 2) {
        redirectFunc(search_dom_node.value);
    }
});

const searchFunc = query => {
    let node = document.getElementById('search_siteplug');
    document.body.removeChild(node);

    let newNode = document.createElement('script');
    newNode.id = 'search_siteplug';
    newNode.src = 'https://cwc89.siteplug.com/sssapi?o=cwc89&s=61071&kw=' + query + '&itype=cs&f=json&i=1&it=1&is=36x36&n=5&af=1&di=&callback=renderSearchResult';
    document.body.appendChild(newNode);
}

function renderSearchResult(res) {
    if (typeof res == 'string') {
        let res = JSON.parse(res);
    }
    if (!res['ads']['ad']) {
        return;
    }

    let data = [];

    if (Array.isArray(res['ads']['ad'])) {
        let arr = [...res['ads']['ad']];
        data.push(...arr);
    } else {
        data.push(res['ads']['ad']);
    }

    let trimmedData = data.slice(0, 3);

    let searchBox = document.querySelector('.site_suggest_box');
    let searchList = document.querySelector('.site_suggest_ads');

    if (trimmedData.length > 0) {
        searchBox.style.display = 'block';
        searchList.style.display = 'block';
        let listFragment = new DocumentFragment();

        trimmedData.forEach(i => {
            let li = document.createElement('li');
            li.classList.add('li_row');
            li.innerHTML = `<div class="ad_list">
                <a href="${i.rurl}">
                <div id="icon">
                    <img id="brand_image" class="img-responsive ads-img img-auto" src="${i.iurl}" alt="${i.brand}">
                </div>
                <div class="site_ad_title word-wrap">
                    <h3 id="brand_title" class="word-wrap">${i.brand}
                    </h3>
                    <p id="ad_domain" class="domain_url">${i.durl}</p>
                </div>
                </a>
            </div>`;
            listFragment.appendChild(li);
        });
        searchList.innerHTML = '';
        searchList.appendChild(listFragment);
    } else {
        searchBox.style.display = 'none';
        searchList.style.display = 'none';
    }
};

// REDIRECT FUNCTION
const redirectFunc = (query) => {
    let node = document.getElementById('site_redirect');
    document.body.removeChild(node);

    let newNode = document.createElement('script');
    newNode.id = 'site_redirect';
    newNode.src = 'https://edd31.siteplug.com/sssapi?o=edd31&s=77160&kw=' + query + '&itype=cs&f=json&af=0&di=&callback=redirectMethod';

    document.body.appendChild(newNode);
}

function redirectMethod(res) {
    if (typeof res == 'string') {
        let res = JSON.parse(res);
    }

    let query = document.getElementById('search_in_page').value;

    let ads = res['ads'];
    if (ads != "No Ads for given Keyword.") {
        redirectlink = data['ads']['ad']['rurl'];
        window.open(redirectlink, "_self");
    } else {
        window.open("http://b.scandid.in/api/searchv3?category=product&type=json&subid=INDA&key=tqw5643rasf3gbag&pid=ind&product_key=" + query, "_self");
    }
}

/* helper functions */
const timeSince = (date) => {
    let seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 0)
        return "Just now";

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    if (seconds > 60) {
        return "59 seconds ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

// GOOGLE ADS
var gptadslots = [];
var googletag = googletag || { cmd: [] };

function googleAds() {
    console.log('fetchFlag is true......!');
    googletag.cmd.push(function () {
        let news_dom = document.getElementById('all_news');
        if (news_dom.hasChildNodes) {
            // modify here if you want ads position changed
            let news__1 = '2';
            let news__2 = '4';

            // news DOM nodes
            let newsNode_1 = document.getElementById(`top_news_${news__1}`);
            let newsNode_2 = document.getElementById(`top_news_${news__2}`);

            // creating Ads DOM nodes -- FIRST
            let ads1 = new DocumentFragment();

            let item_1 = document.createElement("li");
            item_1.setAttribute('id', 'top_news_ads1');
            item_1.setAttribute('style', 'display:none;');

            let div__1 = document.createElement("div");
            div__1.setAttribute('id', 'div-gpt-ad-1551357349271-9');
            div__1.setAttribute('class', 'top_div1');

            item_1.appendChild(div__1);
            ads1.appendChild(item_1);

            // creating Ads DOM nodes -- SECOND
            let ads2 = new DocumentFragment();

            let item_2 = document.createElement("li");
            item_2.setAttribute('id', 'top_news_ads2');
            item_2.setAttribute('style', 'display:none;');

            let div__2 = document.createElement("div");
            div__2.setAttribute('id', 'div-gpt-ad-1565767605361-0');
            div__2.setAttribute('class', 'top_div1');

            item_2.appendChild(div__2);
            ads2.appendChild(item_2);

            // append to the DOM
            console.log('Appending Ads to........: ', newsNode_1, newsNode_2);
            news_dom.insertBefore(ads1, newsNode_1);
            news_dom.insertBefore(ads2, newsNode_2);

            // SRA
            googletag.pubads().enableSingleRequest();
            googletag.pubads().collapseEmptyDivs();

            googletag.pubads().addEventListener('slotVisibilityChangedEvent', function (event) {
                console.log(':|');
            });

            let adSlot1, adSlot2;
            var arrAds = ['/42115163/IP_start.indusos.com_320X100_Mobile', '/42115163/IP_start.indusos.com_300X250_Mobile'];

            googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                switch(event.slot.getAdUnitPath()){
                    case '/42115163/IP_start.indusos.com_320X100_Mobile':
                            console.log('Ad 1 HTML loaded@ '+  (Date.now()-timerStart) + ' ms ');
                            document.querySelector('#div-gpt-ad-1551357349271-9 div iframe').onload = function(){ 
                                document.getElementById('top_news_ads1').style.display = 'list-item';
                                console.log('Ad 1 Content loaded@ '+  (Date.now()-timerStart) + ' ms ');
                            }
                            break;
                    case '/42115163/IP_start.indusos.com_300X250_Mobile':
                            console.log('Ad 2 HTML loaded@ '+  (Date.now()-timerStart) + ' ms ');
                            document.querySelector('#div-gpt-ad-1565767605361-0 div iframe').onload = function(){
                                document.getElementById('top_news_ads2').style.display = 'list-item';
                                console.log('Ad 2 Content loaded@ '+  (Date.now()-timerStart) + ' ms ');
                            }
                            break;
                }
            });


            adSlot1 = googletag.defineSlot('/42115163/IP_start.indusos.com_320X100_Mobile', [[300, 100], [768, 100], [144, 100], [320, 100], [375, 100], [1024, 100]], "div-gpt-ad-1551357349271-9").addService(googletag.pubads());
            adSlot1.set('adsense_border_color', '#ffffff');
            adSlot1.set('adsense_link_color', '#ffffff');

            adSlot2 = googletag.defineSlot('/42115163/IP_start.indusos.com_300X250_Mobile', [[300, 250], [768, 100], [144, 100], [320, 100], [375, 100], [1024, 100]], 'div-gpt-ad-1565767605361-0').addService(googletag.pubads());
            adSlot2.set('adsense_border_color', '#ffffff');
            adSlot2.set('adsense_link_color', '#ffffff');

            googletag.NamedSize = 'fluid';
            googletag.enableServices();

            googletag.display('div-gpt-ad-1551357349271-9');
            googletag.display('div-gpt-ad-1565767605361-0');

        } else {
            console.log('News list is empty!');
            return
        }
    });
}

setTimeout(function () {

    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-47795566-10', 'auto');
    ga('send', 'pageview');


}, 12000);

function show_nextitem() {

    var current_status = document.getElementsByClassName('fourinch')[0].style.display;
    var arrow_el = document.getElementById("change_arrowicon");
    var x = document.getElementsByClassName('fourinch');

    var arrImg = document.getElementById('arrow_img');
    if (current_status == "none" || current_status == "") {
        arrImg.src = 'assets/images/up-arrow-sc.svg';
        for (var i = 0; i < x.length; i++) {
            x[i].style.display = "block";
        }
    } else {
        arrImg.src = 'assets/images/down-arrow-sc.svg';
        for (var i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }

    }
}
