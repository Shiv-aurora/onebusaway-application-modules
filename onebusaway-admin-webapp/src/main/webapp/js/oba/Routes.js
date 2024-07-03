/*
 * Copyright (c) 2013 Metropolitan Transportation Authority
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).ready(function() {
    // TODO: Replace hover with mouseenter and mouseleave https://api.jquery.com/hover/
    $('p.name > a').hover(
        function() {
            var parentTag = $(this).parent().css('border-bottom-color');
            $(this).css('color', parentTag);
        }, function() {
            $(this).css('color', '#000');
        }
        );
});