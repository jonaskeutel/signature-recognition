'use strict'
import {Pipe, PipeTransform} from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'sanitize'})
export class SanitizeHtml implements PipeTransform {
  transform(value:string, args:any[]) : any {
    let allowedTags:String[] = []
    if(args.length === 1)
      allowedTags = args[0]

    let tags = value
      .match(/\<.*?\>/g)
      .map(function(tag){
        tag = tag.replace(/\<\//g, '')
        tag = tag.replace(/\</g, '')
        tag = tag.replace(/\>/g, '')
        return tag
      })
      .filter(function(tag){
        return allowedTags.indexOf(tag) == -1
      })
      
    for(var i=0; i<tags.length; i++){
        let beginningTag = new RegExp('\<'+tags[i]+'\>', 'g')
        let endTag = new RegExp('\<\/'+tags[i]+'\>', 'g')
        value = value.replace(beginningTag, '')
        value = value.replace(endTag, '')
    }

    value = value.replace(/\n/g, '<br>')

    return value
  }
}
