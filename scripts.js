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
			case "hotswap": this.refilter(/hotswap/i, this.cfg.socketsRule); break;
			case "soldered": this.refilter(/soldered/i, this.cfg.socketsRule); break;
			case "topre": this.refilter(/topre/i, this.cfg.socketsRule); break;
			case "iso_int": this.refilter(/int-iso/i, this.cfg.kittingsRule); break;
			case "iso_uk": this.refilter(/uk-iso/i, this.cfg.kittingsRule); break;
			case "iso_kb": this.refilter(/iso/i, this.cfg.layoutRule); break;
			case "ansi": this.refilter(/ansi/i, this.cfg.kittingsRule); break;
			case "ansi_kb": this.refilter(/ansi/i, this.cfg.layoutRule); break;
			case "tsangan": this.refilter(/tsangan/i, this.cfg.layoutRule); break;
			case "1800_kb": this.refilter(/8k|1800/i, this.cfg.sizeRule); break;
			case "alice": this.refilter(/alice/i, this.cfg.kittingsRule); break;
			case "numpad": this.refilter(/numpad/i, this.cfg.kittingsRule); break;
			case "60pct": this.refilter(/60%|60pct/i, this.cfg.sizeRule); break;
			case "65pct": this.refilter(/65%|65pct|frltkl/i, this.cfg.sizeRule); break;
			case "60%": this.refilter(/60%|60pct/i, this.cfg.kittingsRule); break;
			case "65%": this.refilter(/65%|65pct/i, this.cfg.kittingsRule); break;
			case "tkl": this.refilter(/^tkl$/i, this.cfg.sizeRule); break;
			case "1800": this.refilter(/1800/i, this.cfg.sizeRule); break;
			case "normal_travel": this.refilter(/normal/i, this.cfg.travelRule); break;
			case "reduced_travel": this.refilter(/long pole/i, this.cfg.travelRule); break;
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
	sizeRule: "dd.size",
	sortingRule: "select",
	zoomingRule: '[name="zoom"]',
	expandingRule: '[name="expanded"]',
	unwantingRule: '[name="unwanted"]',
	indicatorsRule: "figure button",
	travelRule: "dd.travel"
});
