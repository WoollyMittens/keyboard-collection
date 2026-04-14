function importImages() {
	const images = document.querySelectorAll('img');
	const list = []; 
	images.forEach(image => list.push(`cp ${image.getAttribute('src')} temp`));
	console.log(list.join('\n'));
}

class OrderBy {
	constructor(cfg) {
		// model
		this.cfg = cfg;
		// objects
		this.container = document.querySelector(cfg.containerRule);
		this.items = document.querySelectorAll(cfg.itemsRule);
		this.sorter = document.querySelector(cfg.sortingRule);
		this.zoomer = document.querySelector(cfg.zoomingRule);
		this.expander = document.querySelector(cfg.expandingRule);
		this.unwanter = document.querySelector(cfg.unwantingRule);
		this.indicators = document.querySelectorAll(cfg.indicatorsRule);
		// events
		this.zoomer.addEventListener("change", this.rezoom.bind(this));
		this.sorter.addEventListener("change", this.resort.bind(this));
		this.expander.addEventListener("change", this.expand.bind(this));
		this.unwanter.addEventListener("change", this.unwant.bind(this));
		for (let indicator of this.indicators) {
			indicator.addEventListener("click", this.indicate.bind(this, indicator));
		}
		// restore the saved value
		this.restore();
	}

	store() {
		// store the interface values
		window.localStorage.setItem('kbd', JSON.stringify({
			// store the zoom value
			'zoom': this.zoomer.value,
			// store the sort value
			'sort': this.sorter.value,
			// store the expand value
			'expand': this.expander.checked,
			// store the wanted value
			'wanted': this.unwanter.checked
		}));
	}

	restore() {
		// restore the saved values
		const values = JSON.parse(window.localStorage.getItem('kbd'));
		// restore the zoom value
		this.zoomer.value = values?.zoom;
		this.rezoom();
		// restore the sort value
		this.sorter.value = values?.sort;
		this.resort();
		// restore the expand value
		this.expander.checked = values?.expand;
		this.expand();
		// restore the wanted value
		this.unwanter.checked = values?.wanted;
		this.unwant();
		// restore the scoring system
		this.rescore();
	}

	rescore() {
		// if the keyboard properties are on the page
		if (document.querySelector(this.cfg.bottomRule)) {
			// for every item
			for (let item of this.items) {
				// set the default score
				let total = 0;
				// bottom material
				total += /polycarbonate|acrylic/i.test(item.querySelector(this.cfg.bottomRule).innerHTML) ? 32 : 0;
				total += /brass|copper/i.test(item.querySelector(this.cfg.bottomRule).innerHTML) ? 96 : 0;
				// weight type
				total += /external/i.test(item.querySelector(this.cfg.weightRule).innerHTML) ? 8 : 0;
				total += /internal|through/i.test(item.querySelector(this.cfg.weightRule).innerHTML) ? 32 : 0;
				// weight material
				total += /steel|zinc/i.test(item.querySelector(this.cfg.weightRule).innerHTML) ? 8 : 0;
				total += /brass|copper/i.test(item.querySelector(this.cfg.weightRule).innerHTML) ? 16 : 0;
				// pcb standard
				total += /common/i.test(item.getAttribute('data-standard')) ? 32 : 0;
				// available spares
				total += item.querySelector(this.cfg.sparesRule).innerHTML.split(/\.|,/g).length * 4;
				// socket style
				total += /hotswap/i.test(item.querySelector(this.cfg.socketsRule).innerHTML) ? 8 : 0;
				total += /soldered/i.test(item.querySelector(this.cfg.socketsRule).innerHTML) ? 16 : 0;
				total += /topre/i.test(item.querySelector(this.cfg.socketsRule).innerHTML) ? 32 : 0;
				// mounting style
				total += /sandwich/i.test(item.querySelector(this.cfg.mountRule).innerHTML) ? -16 : 0;
				total += /tray|pcb/i.test(item.querySelector(this.cfg.mountRule).innerHTML) ? -8 : 0;
				total += /gasket|hotdog|o-ring/i.test(item.querySelector(this.cfg.mountRule).innerHTML) ? 16 : 0;
				total += /tadpole/i.test(item.querySelector(this.cfg.mountRule).innerHTML) ? 24 : 0;
				total += /top/i.test(item.querySelector(this.cfg.mountRule).innerHTML) ? 32 : 0;
				// plate material
				total += /brass|copper/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 4 : 0;
				total += /steel/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 8 : 0;
				total += /pom/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 12 : 0;
				total += /carbon fibre/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 16 : 0;
				total += /polycarbonate/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 20 : 0;
				total += /acrylic/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 24 : 0;
				total += /fr4/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 28 : 0;
				total += /aluminium/i.test(item.querySelector(this.cfg.plateRule).innerHTML) ? 32 : 0;
				// actuation style
				total += /(?=silent)(?=linear)/i.test(item.querySelector(this.cfg.actuationRule).innerHTML) ? -16 : 0;
				total += /(?=silent)(?=tactile)/i.test(item.querySelector(this.cfg.actuationRule).innerHTML) ? 8 : 0;
				total += /tactile/i.test(item.querySelector(this.cfg.actuationRule).innerHTML) ? 24 : 0;
				total += /linear/i.test(item.querySelector(this.cfg.actuationRule).innerHTML) ? 32 : 0;
				// switch quality
				total += /durock|jwk/i.test(item.querySelector(this.cfg.switchesRule).innerHTML) ? 16 : 0;
				total += /gateron/i.test(item.querySelector(this.cfg.switchesRule).innerHTML) ? 24 : 0;
				total += /cherry|topre/i.test(item.querySelector(this.cfg.switchesRule).innerHTML) ? 32 : 0;
				// keycaps quality
				total += /jtk|xmi|xiami|jkdk/i.test(item.querySelector(this.cfg.keycapsRule).innerHTML) ? 4 : 0;
				total += /epbt|cannoncaps/i.test(item.querySelector(this.cfg.keycapsRule).innerHTML) ? 8 : 0;
				total += /gmk|shenpo|keykobo|kkb|jc/i.test(item.querySelector(this.cfg.keycapsRule).innerHTML) ? 16 : 0;
				total += /dcs|crp/i.test(item.querySelector(this.cfg.keycapsRule).innerHTML) ? 24 : 0;
				// form factor
				total += /alice/i.test(item.querySelector(this.cfg.sizeRule).innerHTML) ? 8 : 0;
				total += /60pct|60%/i.test(item.querySelector(this.cfg.sizeRule).innerHTML) ? 16 : 0;
				total += /tkl/i.test(item.querySelector(this.cfg.sizeRule).innerHTML) ? 32 : 0;
				// layout
				total += /ISO/i.test(item.querySelector(this.cfg.layoutRule).innerHTML) ? 16 : 0;
				// problems
				total += item.querySelector(this.cfg.problemsRule).innerHTML.split(/\.|,/g).length * -10;
				// update the score
				item.querySelector(this.cfg.scoresRule).innerHTML = total;
				// update the sort order
				item.style.order = 1000 - total;
			}
		}
	}

	refilter(value, rule) {
		// filter the items
		console.log(value, rule);
		for(let item of this.items) {
			let container = item.querySelector(rule);
			if (container) item.setAttribute("data-filtered", value.test(container.innerHTML));
		}
	}

	rezoom(evt) {
		// set the zoom level
		this.container.style.zoom = this.zoomer.value;
		// update the stored values
		if (evt) this.store();
	}

	resort(evt) {
		// apply specific filter
		this.container.setAttribute("data-sorting", this.sorter.value);
		console.log('this.sorter.value', this.sorter.value);
		switch(this.sorter.value) {
			case "score": this.rescore(); break;
			case "hotswap_kb": this.refilter(/hotswap/i, this.cfg.socketsRule); break;
			case "soldered_kb": this.refilter(/soldered/i, this.cfg.socketsRule); break;
			case "topre_kb": this.refilter(/topre/i, this.cfg.socketsRule); break;
			case "weighted_kb": this.refilter(/internal|external|through/i, this.cfg.weightRule); break;
			case "iso_kb": this.refilter(/iso/i, this.cfg.layoutRule); break;
			case "ansi_kb": this.refilter(/ansi/i, this.cfg.layoutRule); break;
			case "tsangan_kb": this.refilter(/tsangan/i, this.cfg.layoutRule); break;
			case "1800_kb": this.refilter(/8k|1800/i, this.cfg.sizeRule); break;
			case "60pct_kb": this.refilter(/60%|60pct/i, this.cfg.sizeRule); break;
			case "65pct_kb": this.refilter(/65%|65pct|frltkl/i, this.cfg.sizeRule); break;
			case "tkl_kb": this.refilter(/^tkl$/i, this.cfg.sizeRule); break;
			case "1800_kb": this.refilter(/1800/i, this.cfg.sizeRule); break;
			case "normal_travel_kb": this.refilter(/normal/i, this.cfg.travelRule); break;
			case "reduced_travel_kb": this.refilter(/long pole/i, this.cfg.travelRule); break;
			case "ansi": this.refilter(/ansi/i, this.cfg.kittingsRule); break;
			case "iso_int": this.refilter(/int-iso/i, this.cfg.kittingsRule); break;
			case "iso_uk": this.refilter(/uk-iso/i, this.cfg.kittingsRule); break;
			case "alice": this.refilter(/alice/i, this.cfg.kittingsRule); break;
			case "numpad": this.refilter(/numpad/i, this.cfg.kittingsRule); break;
			case "60pct": this.refilter(/60%|60pct/i, this.cfg.kittingsRule); break;
			case "65pct": this.refilter(/65%|65pct/i, this.cfg.kittingsRule); break;
			default: this.refilter(/.*/, "dd");
		}
		// update the stored values
		if (evt) this.store();
	}

	expand(evt) {
		// add the expand flag
		this.container.setAttribute("data-expand", this.expander.checked);
		// update the stored values
		if (evt) this.store();
	}

	unwant(evt) {
		// add the unwanted flag
		this.container.setAttribute("data-unwanted", this.unwanter.checked);
		// update the stored values
		if (evt) this.store();
	}

	indicate(indicator) {
		// update the slide
		indicator.parentNode.parentNode.setAttribute("data-view", indicator.getAttribute("class"));
	}
}

new OrderBy({
	containerRule: "section",
	itemsRule: "li",
	socketsRule: "dd.sockets",
	kittingsRule: "dd.kitting",
	layoutRule: "dd.layout, dd.kitting",
	weightRule: "dd.weight",
	sizeRule: "dd.size",
	sortingRule: "select",
	zoomingRule: '[name="zoom"]',
	expandingRule: '[name="expanded"]',
	unwantingRule: '[name="unwanted"]',
	indicatorsRule: "figure button",
	scoresRule: "dd.score",
	travelRule: "dd.travel",
	sparesRule: "dd.spares",
	mountRule: "dd.mount",
	bottomRule: "dd.bottom",
	plateRule: "dd.plate",
	actuationRule: "dd.actuation",
	switchesRule: "dd.switches",
	keycapsRule: "dd.keycaps",
	problemsRule: "dd.problems"
});
