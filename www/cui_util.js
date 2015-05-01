/*
 * Copyright 2015 Canopy Services, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Get an object's keys as an array.
 */
function cuiKeys(obj) {
    var out = [];
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            out.push(key);
        }
    }
    return out;
}

/*
 * Compares <obj0> to <obj1>.
 *
 * For each key in <obj0> that is not in <obj1>, calls fnRemove.
 * For each key in <obj1> that is not in <obj0>, calls fnAdd,
 * For each key that is in both, calls fnUpdate
 */
function cuiObjectDiff(obj0, obj1, fnAdd, fnUpdate, fnRemove) {
    var obj0Keys = cuiKeys(obj0);
    var obj1Keys = cuiKeys(obj1);
    for (var i = 0; i < obj0Keys.length; i++) {
        var key = obj0Keys[i];
        if (obj1[key] === undefined) {
            fnRemove(key, obj0[key]);
        } else {
            fnUpdate(key, obj0[key], obj1[key]);
        }
    }
    for (var i = 0; i < obj1Keys.length; i++) {
        var key = obj1Keys[i];
        if (obj0[key] === undefined) {
            fnAdd(key, obj1[key]);
        }
    }
}
