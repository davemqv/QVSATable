define(["qvangular", "core.utils/deferred", "objects.backend-api/hypercube-api", "extensions.qliktech/straight-table/straight-table-properties", "text!extensions.qliktech/straight-table/straight-table.ng.html", "objects.extension/base-controller", "objects.extension/object-conversion", "general.utils/array-util", "extensions.qliktech/straight-table/snapshot/snapshot-helper", "general.utils/support", "general.scroll/api/vertical-scroll-api", "general.scroll/api/dom-api", "general.scroll/api/data-api", "objects.utils/event-utils", "objects.grid/data-grid", "objects.grid/services/data-service", "objects.grid/services/selections", "extensions.qliktech/straight-table/layout/top/straight-table-top-header", "extensions.qliktech/straight-table/layout/header-cell/straight-table-header-cell", "extensions.qliktech/straight-table/layout/data/straight-table-data", "extensions.qliktech/straight-table/layout/data-cell/straight-table-data-cell", "extensions.qliktech/straight-table/layout/bottom/straight-table-bottom-header", "extensions.qliktech/straight-table/properties/columns/columns", "extensions.qliktech/straight-table/column-picker/column-picker", "objects/listbox-popover/listbox-popover-service"], function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
										"use strict";
										var p,
										q,
										r,
										s;
										return q = k.extend({
												destroy : function () {
													this._super.apply(this, arguments),
													this.$timeout.cancel(this.updateTopBottomPromise)
												},
												init : function (a, b, c) {
													this.isSnapshot = c,
													this.topBottomStyle = {},
													this.alignTotals = !1,
													this._super.apply(this, arguments)
												},
												updateTopBottom : function () {
													this.updateTopBottomPromise = this.$timeout(function () {
															var a = this.domApi.getClientWidth(),
															b = this.domApi.getScrollContentBoundingBox().height,
															c = this.domApi.getScrollAreaClientHeight(),
															d = this.domApi.getScrollAreaClientWidth();
															if (b > c || this.alignBottom ? (this.alignTotals = !1, this.topBottomStyle.marginRight = a - d) : (this.alignTotals = !0, this.topBottomStyle.marginRight = 0), this.virtualScrollEnabled && !this.isSnapshot) {
																var e = this.dataApi.getRowCount(),
																f = Math.ceil(c / this.settings.minRowHeight),
																g = e - (e - f);
																e > f && (this.dataApi.getRows().splice(g), this.settings.viewportRowCount = f)
															}
														}
															.bind(this))
												},
												updateAlignBottom : function () {
													this._super(),
													this.updateTopBottom()
												}
											}),
										r = m.extend({
												init : function (a) {
													this.visualizationCtrl = a
												},
												getRows : function () {
													return this.visualizationCtrl.getRows()
												},
												getRowCount : function () {
													return this.visualizationCtrl.getRowCount()
												},
												getFirstElementIndex : function () {
													return this.visualizationCtrl.getFirstElementIndex()
												},
												getLastElementIndex : function () {
													return this.visualizationCtrl.getLastElementIndex()
												},
												onVirtualScroll : function (a, b) {
													return this.visualizationCtrl.onVirtualScroll(a, b)
												},
												onInitialNativeScroll : function (a, b) {
													return this.visualizationCtrl.onInitialNativeScroll(a, b)
												},
												onGotoNextBlock : function (a, b) {
													return this.visualizationCtrl.onGotoNextBlock(a, b)
												},
												onGotoPreviousBlock : function (a, b) {
													return this.visualizationCtrl.onGotoPreviousBlock(a, b)
												}
											}),
										s = l.extend({
												init : function (a, b, c, d, e, f) {
													this.snapshotObject = f,
													this._super.apply(this, arguments)
												},
												getBoundingBox : function () {
													var a;
													return a = this.snapshotObject.freeResize ? this.$element[0].getBoundingClientRect() : {
														height : this.snapshotObject.size.h,
														width : this.snapshotObject.size.w
													}
												}
											}),
										p = f.extend({
												handledColumnOrderMigration : function () {
													var a = this.$scope;
													return void 0 === a.layout.qHyperCube.columnOrder || a.layout.qHyperCube.columnOrder.length && "number" != typeof a.layout.qHyperCube.columnOrder[0] ? (this.appliedSoftPatch || (void 0 === a.layout.qHyperCube.columnOrder ? a.applyColumnOrderSoftPatch(!0, this.dataService.columnOrder.get(a.layout.qHyperCube.qDimensionInfo, a.layout.qHyperCube.qMeasureInfo)) : a.applyColumnOrderSoftPatch(!1, a.layout.qHyperCube.columnOrder.map(function (a) {
																	return a.dataColIx
																})), this.appliedSoftPatch = !0), !0) : !1
												},
												init : function (a, b, c, d) {
													this.appliedSoftPatch = !1,
													this._paintWatches = [],
													this._resizeWatches = [],
													this.dataService = c,
													this.selectionService = d,
													this.$timeout = b,
													this.metaHeaders = [],
													this._super.apply(this, arguments),
													a.backendApi.setCacheOptions({
														width : 1
													}),
													Object.defineProperties(a, {
														isDesktop : {
															get : function () {
																return j.treatAsDesktop()
															}
														}
													})
												},
												watchPaint : function (a) {
													var b = this;
													return b._paintWatches.push(a),
													function () {
														var c = b._paintWatches.indexOf(a);
														b._paintWatches.splice(c, 1)
													}
												},
												watchResize : function (a) {
													var b = this;
													return b._resizeWatches.push(a),
													function () {
														var c = b._resizeWatches.indexOf(a);
														b._resizeWatches.splice(c, 1)
													}
												},
												update : function (a, c, d, e, f) {
													var g = this.getDataInfo(a, c, f),
													h = b();
													return this.$scope.backendApi.getData(g.rects).then(function (a) {
														this.onUpdateData({
															dataPages : a,
															dataInfo : g
														}, d, e, f).then(function () {
															h.resolve(a)
														})
													}
														.bind(this)),
													h.promise
												},
												updateLocked : function (a) {
													var b,
													c,
													d,
													e,
													f,
													g,
													h,
													i = this.dataService,
													j = this.selectionService,
													k = this.$scope.selections,
													l = k.activationCell,
													m = [];
													if (l) {
														for (b = a.getRowsByCellType(a.CELL_TYPE_DATA), f = i.getSiblingCells(a, l), c = b.length, h = 0; c > h; ++h)
															m = m.concat(b[h].cells);
														for (e = m.length, h = 0; e > h; ++h)
															d = m[h], g = -1 !== f.indexOf(d), (g && !d.isDimensionValue || !g && !d.isMeta) && j[l && k.active ? "lockCell" : "unlockCell"](a, d)
													}
												},
												getDataInfo : function (a, b, c) {
													var d,
													e,
													f,
													g = [];
													for (c ? e = this.metaHeaders : (e = this.dataService.getStraightMetaHeaders(this.$scope.layout, this.$scope.scrollApi.settings, this.$scope.$id), this.metaHeaders = e), f = e.length, d = 0; f > d; ++d)
														e[d].isSearchIcon || g.push({
															qLeft : e[d].qLeft,
															qTop : a || 0,
															qWidth : 1,
															qHeight : b
														});
													return g.length || g.push({
														qTop : 0,
														qLeft : 0,
														qWidth : 0,
														qHeight : 0
													}), {
														rects : g,
														metaHeaders : e
													}
												},
												onUpdateData : function (a, b, c, d) {
													return c && a.dataPages.forEach(function (a) {
														a.qMatrix.reverse()
													}),
													this.dataService.updateStraightItems(this.$scope, a.dataPages, a.dataInfo.metaHeaders, b, c, d),
													c && this.$scope.grid.rows.reverse(),
													this.$scope.selections.active && (this.selectionService.updateStraight(this.$scope.grid, this.$scope.selections, this.$scope.selections.activationCell), this.updateLocked(this.$scope.grid)),
													this.$scope.backendApi.isSnapshot && i.scaleDynamically(this.$scope),
													this.$scope.scrollApi.updateTopBottom(),
													this.$timeout(function () {}, 0, !1)
												},
												setSnapshotData : function (a) {
													var b,
													c,
													d = !!a.sourceObjectId,
													e = this.$scope,
													f = e.scrollApi.domApi,
													g = f.getScrollAreaBoundingBox(),
													h = f.$scrollArea.find(".qv-st-data-row"),
													j = e.scrollApi.settings.columnCount;
													return b = i.getIndexHeightAndWidth(h, j, g),
													c = this.getDataInfo(b.index, b.height),
													c.rects.splice(b.width),
													e.backendApi.getData(c.rects).then(function (f) {
														a.qHyperCube.qDataPages = f,
														a.snapshotData.object.dataTableRowCount = b.height,
														a.snapshotData.object.dataTableHeight = e.isDesktop ? g.height : g.height * (2 / 3),
														a.snapshotData.object.size.h *= e.isDesktop ? 1 : 2 / 3;
														var h = e.layout.qHyperCube.columnOrder.slice(0, c.rects.length);
														return d || (a.qHyperCube.columnOrder = h),
														a
													})
												},
												process : function (a, c, d) {
													return this.handledColumnOrderMigration() ? b.resolve() : this.update(a, c, !1, !1, !1).then(function () {
														this.$scope.scrollApi.setTotalRows(this.$scope.layout.qHyperCube.qSize.qcy),
														this.$scope.scrollApi.setVirtualSize(d)
													}
														.bind(this))
												},
												processPaint : function () {
													var a,
													b,
													c = 0;
													return a = this.$scope.scrollApi.settings.viewportRowCount,
													b = this.$scope.scrollApi.resetNativeScroll(),
													this.process(c, a, !1).then(function () {
														b()
													})
												},
												processResize : function () {
													var a = this.$scope.grid.rows.length,
													b = a ? this.$scope.grid.rows[0].getIndex() : 0,
													c = this.$scope.scrollApi.settings.viewportRowCount;
													return a > c && (c = a),
													this.process(b, c, !0)
												},
												onVirtualScroll : function (a, b) {
													return this.update(a, b, !1, !1, !0)
												},
												gotoBlock : function (a, b, c) {
													var d = this.$scope.scrollApi.getSpliceArgs(),
													e = this.$scope.grid.rows,
													f = this.$scope.grid.getNextRowIx();
													return c && e.reverse(),
													e.splice.apply(e, d),
													f -= d[1],
													this.$scope.grid.setNextRowIx(f),
													this.update(a, b, !0, c, !0)
												},
												onGotoNextBlock : function (a, b) {
													return this.gotoBlock(a, b, !1)
												},
												onGotoPreviousBlock : function (a, b) {
													return this.gotoBlock(a, b, !0)
												},
												getRows : function () {
													return this.$scope.grid.rows
												},
												getRowCount : function () {
													return this.$scope.grid.rows.length
												},
												getFirstElementIndex : function () {
													return this.$scope.grid.rows[0].getIndex()
												},
												getLastElementIndex : function () {
													return this.$scope.grid.rows[this.$scope.grid.rows.length - 1].getIndex()
												}
											}),
										p.$inject = ["$scope", "$timeout", "qvGridObjectDataService", "qvGridObjectSelectionService"],
										a.directive("qvStraightTable", ["$timeout", "qvGridObjectDataService", "qvGridObjectSelectionService", "qvListboxPopoverService", function (a, c, d, f) {
													return {
														restrict : "E",
														replace : !0,
														template : e,
														require : ["qvStraightTable", "^qvObject"],
														controller : p,
														link : function (e, g, i, j) {
															function k(a, b) {
																return x[a]().then(function () {
																	b.forEach(function (a) {
																		a()
																	})
																})
															}
															function m() {
																x.updateLocked(e.grid),
																w && w()
															}
															function p() {
																c.getSiblingCells(e.grid, e.selections.activationCell).forEach(function (a) {
																	d.deselectCell(e.grid, a)
																}),
																x.updateLocked(e.grid),
																w && w()
															}
															function t() {
																e.selections.active && e.selections.activationCell && (c.getSiblingCells(e.grid, e.selections.activationCell).forEach(function (a) {
																		d.deselectCell(e.grid, a)
																	}), x.updateLocked(e.grid))
															}
															function u() {
																e.object.selectionsClass = "",
																x.updateLocked(e.grid)
															}
															function v(a, b) {
																var c,
																d,
																e = a.length;
																for (c = 0; e > c; ++c)
																	if (d = a[c], d.dataRowIx === b)
																		return d
															}
															var w,
															x = j[0],
															y = j[1],
															z = g.find(".qv-grid-object-scroll-area"),
															A = z.controller("qvScrollArea"),
															B = g.find(".qv-scroll-loader:not(.qv-scroll-row-loader)").controller("qvScrollLoader"),
															C = z.find(".qv-scroll-row-loader").controller("qvScrollLoader"),
															D = "." + e.id + "-straight-table",
															E = {
																minRowHeight : 29,
																columnCount : 0,
																column : {
																	minWidth : 102,
																	minSearchWidth : 25,
																	glyphWidth : 8,
																	maxMeasureWidth : 350
																},
																columnPicker : {
																	show : !1,
																	width : 21
																},
																blockSize : 50
															},
															F = e.scrollApi = new q(a, E, e.backendApi.isSnapshot),
															G = new r(x),
															H = e.backendApi.isSnapshot ? new s(g, z, "", "", null, e.layout.snapshotData.object) : new l(g, z, ".qv-grid-object-data-first-row", ".qv-grid-object-data-last-row");
															e.grid = new o("straight"),
															e.selections = d.$new(),
															e.$on("$destroy", function () {
																F.destroy(),
																g.off(D)
															}),
															g.on("contextmenu" + D, function (a) {
																e.selections.active && a.preventDefault()
															}),
															F.initialize(H, G, A, B).then(function () {
																x.onStateChanged = function (a) {
																	x.allowInteraction(a) ? (e.interactive = !0, e.scrollApi.activate()) : (e.interactive = !1, e.scrollApi.deactivate())
																},
																x.setInteraction = function (a) {
																	e.scrollApi[a ? "activate" : "deactivate"]()
																},
																x.onPaint = function () {
																	return this.$scope.selections.active ? b.resolve() : k("processPaint", x._paintWatches)
																},
																x.onResize = function () {
																	return e.scrollApi.updateViewport(),
																	k("processResize", x._resizeWatches)
																},
																x.onInitialNativeScroll = function (a, b) {
																	return C.fadeIn(null, {
																		width : "100%",
																		height : "30px"
																	}, "relative").then(function () {
																		return x.update(a, b, !0, !1, !0).then(function () {
																			return C.fadeOut()
																		})
																	})
																},
																y.addChildController(x)
															}),
															e.applyColumnOrderSoftPatch = function (a, b) {
																var c = [[], !0],
																d = a ? "add" : "replace";
																c[0][0] = {
																	qPath : "/qHyperCubeDef/columnOrder",
																	qOp : d.toString(),
																	qValue : JSON.stringify(b)
																},
																e.backendApi.applyPatches(c)
															},
															d.init(e.selectionsApi, e.backendApi, e.selections, m, p, t);
															var I = e.selectionsApi.ignoreOnOutside;
															e.selectionsApi.ignoreOnOutside = function (a) {
																return a.closest(".qv-st-dim-columns").length ? !0 : I(a) || a.closest(".qv-st-selections-active").length ? !0 : void 0
															},
															e.selectionsApi.getMenuMaxHeight = function () {
																return g.outerHeight()
															},
															e.selectWhileLocked = function () {
																n.showLockedFeedback(e.layout.qHyperCube.qDimensionInfo)
															},
															e.selectDimensionValue = function (a, b) {
																e.scrollApi.updateViewport(),
																e.selectionsApi.getKeyAsToggleSelected(b) || (t(), d.reset(e.selections)),
																w = d.selectDimensionValue(e.$id, e.backendApi, e.selectionsApi, e.selections, a, e.grid, !0);
																var c = e.selectionsApi.watchActivated(function () {
																		u(),
																		c()
																	})
															},
															e.activateSelections = function (a) {
																e.scrollApi.updateViewport(),
																w = d.activateSelections(e.$id, e.backendApi, e.selectionsApi, e.selections, a);
																var b = e.selectionsApi.watchActivated(function () {
																		u(),
																		b()
																	})
															},
															e.multiselectDimensionValues = function (a, b) {
																function f(a) {
																	var b = v(h, a);
																	b && b.isDimensionValue && d.selectDimensionCells(e.backendApi, e.selectionsApi, e.selections, e.grid, b, !1)
																}
																var g,
																h = c.getSiblingCells(e.grid, a),
																i = a.dataRowIx,
																j = b.dataRowIx;
																if (j >= i)
																	for (g = i; j >= g; ++g)
																		f(g);
																else if (i > j)
																	for (g = i; g >= j; --g)
																		f(g)
															},
															e.multiselect = function () {
																e.selections.active && d.sendSelection(e.backendApi, e.selectionsApi, e.selections, e.grid, e.selections.currentCell)
															},
															e.sort = function (a) {
																e.scrollApi.updateViewport();
																var b,
																d,
																f,
																g = a.dataColIx,
																i = [].concat(e.layout.qHyperCube.qEffectiveInterColumnSortOrder),
																j = i[0],
																k = "",
																l = [[], !0];
																g !== j && (f = i.indexOf(g), h.move(i, f, 0)),
																l[0][0] = {
																	qPath : "/qHyperCubeDef/qInterColumnSortOrder",
																	qOp : "replace",
																	qValue : "[" + i.join(",") + "]"
																},
																g === j && (k = a.isDimension ? "/qHyperCubeDef/qDimensions/" : "/qHyperCubeDef/qMeasures/", b = c.getColumnInfo(g, e.layout), a.reversed = !b.qReverseSort, d = a.isDimension ? g : g - e.layout.qHyperCube.qDimensionInfo.length, k += d + "/qDef/qReverseSort", l[0][1] = {
																		qPath : k,
																		qOp : "replace",
																		qValue : a.reversed.toString()
																	}),
																e.backendApi.applyPatches(l)
															},
															e.currentHeaderSearch = null,
															e.search = function (a, b) {
																return e.currentHeaderSearch === b ? (b.open = !1, e.currentHeaderSearch = null, void f.close()) : (e.currentHeaderSearch && (e.currentHeaderSearch.open = !1, e.currentHeaderSearch = null), f.showField(b.fieldName, e.backendApi.model.session.currentApp, {
																		$alignToElement : a,
																		qvaOutsideIgnoreFor : "qv-st-header-cell-search-" + e.$id,
																		collision : "flipfit"
																	}, null, function () {
																		e.currentHeaderSearch && (e.currentHeaderSearch.open = !1),
																		e.currentHeaderSearch = null
																	}), b.open = !0, void(e.currentHeaderSearch = b))
															}
														}
													}
												}
											]), {
											initialProperties : {
												version : .96,
												qHyperCubeDef : {
													qDimensions : [],
													qMeasures : [],
													qSuppressMissing : !0,
													qMode : "S",
													columnOrder : []
												}
											},
											data : {
												dimensions : {
													min : 1,
													max : 1e3,
													add : function (a, b, c) {
														var d = c.hcProperties.columnOrder;
														return h.indexAdded(d, c.getDimensions().length - 1),
														a
													},
													remove : function (a, b, c, d) {
														var e = c.hcProperties.columnOrder;
														h.indexRemoved(e, d)
													}
												},
												measures : {
													add : function (a, b, c) {
														var d = c.hcProperties.columnOrder;
														h.indexAdded(d, c.getDimensions().length + c.getMeasures().length - 1)
													},
													remove : function (a, b, c, d) {
														var e = c.hcProperties.columnOrder,
														f = e.indexOf(d);
														h.indexRemoved(e, f)
													},
													min : 0,
													max : 1e3
												}
											},
											snapshot : {
												canTakeSnapshot : !0
											},
											type : "table",
											template : "<qv-straight-table></qv-straight-table>",
											BackendApi : c,
											definition : d,
											importProperties : function (b, c, d) {
												var e = g.hypercube.importProperties(b, c, d),
												f = e.qProperty.qHyperCubeDef.columnOrder,
												h = e.qProperty.qHyperCubeDef.qDimensions,
												i = e.qProperty.qHyperCubeDef.qMeasures;
												return f.length && h.length + i.length === f.length || (e.qProperty.qHyperCubeDef.columnOrder = a.getService("qvGridObjectDataService").columnOrder.get(h, i)),
												e
											},
											exportProperties : g.hypercube.exportProperties
										}
									})
