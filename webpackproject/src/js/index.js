import '@css/style.css'
import '@scss/style.scss'
import * as $ from 'jquery'
import test from '@/test'
import xml from '@/test.xml'
import csv from '@/test.csv'
import Post from "./Post";
const post = new Post("Post title")
$('pre').html(post.toString())
console.log(test)
console.log(xml)
console.log(csv)