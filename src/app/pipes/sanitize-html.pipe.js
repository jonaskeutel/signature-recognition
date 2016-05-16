'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
var SanitizeHtml = (function () {
    function SanitizeHtml() {
    }
    SanitizeHtml.prototype.transform = function (value, args) {
        var allowedTags = [];
        if (args.length === 1)
            allowedTags = args[0];
        var tags = value
            .match(/\<.*?\>/g)
            .map(function (tag) {
            tag = tag.replace(/\<\//g, '');
            tag = tag.replace(/\</g, '');
            tag = tag.replace(/\>/g, '');
            return tag;
        })
            .filter(function (tag) {
            return allowedTags.indexOf(tag) == -1;
        });
        for (var i = 0; i < tags.length; i++) {
            var beginningTag = new RegExp('\<' + tags[i] + '\>', 'g');
            var endTag = new RegExp('\<\/' + tags[i] + '\>', 'g');
            value = value.replace(beginningTag, '');
            value = value.replace(endTag, '');
        }
        value = value.replace(/\n/g, '<br>');
        return value;
    };
    SanitizeHtml = __decorate([
        core_1.Pipe({ name: 'sanitize' }), 
        __metadata('design:paramtypes', [])
    ], SanitizeHtml);
    return SanitizeHtml;
}());
exports.SanitizeHtml = SanitizeHtml;
//# sourceMappingURL=sanitize-html.pipe.js.map