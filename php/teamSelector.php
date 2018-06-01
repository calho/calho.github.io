<?php
/**
 * Created by IntelliJ IDEA.
 * User: Calvi
 * Date: 2018-05-31
 * Time: 1:38 PM
 */



function test() {
    $doc = new DomDocument;

    $result = $doc->getElementById('result');

    $result->setAttribute('text', 'result');
}


