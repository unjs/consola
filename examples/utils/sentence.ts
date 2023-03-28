import Sentencer from "sentencer";

const sentenceTemplates = [
  "the {{ noun }} is {{ a_noun }}",
  "{{ a_noun }} is {{ an_adjective }} {{ noun }}",
  "the first {{ adjective }} {{ noun }} is, in its own way, {{ a_noun }}",
  "their {{ noun }} was, in this moment, {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }} from the right perspective",
  "the literature would have us believe that {{ an_adjective }} {{ noun }} is not but {{ a_noun }}",
  "{{ an_adjective }} {{ noun }} is {{ a_noun }} of the mind",
  "the {{ adjective }} {{ noun }} reveals itself as {{ an_adjective }} {{ noun }} to those who look",
  "authors often misinterpret the {{ noun }} as {{ an_adjective }} {{ noun }}, when in actuality it feels more like {{ an_adjective}} {{ noun }}",
  "we can assume that any instance of {{ a_noun }} can be construed as {{ an_adjective }} {{ noun }}",
  "they were lost without the {{ adjective }} {{ noun }} that composed their {{ noun }}",
  "the {{ adjective }} {{ noun }} comes from {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} can hardly be considered {{ an_adjective }} {{ noun }} without also being {{ a_noun }}",
  "few can name {{ an_adjective }} {{ noun }} that isn't {{ an_adjective }} {{ noun }}",
  "some posit the {{ adjective }} {{ noun }} to be less than {{ adjective }}",
  "{{ a_noun }} of the {{ noun }} is assumed to be {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} sees {{ a_noun }} as {{ an_adjective }} {{ noun }}",
  "the {{ noun }} of {{ a_noun }} becomes {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }}'s {{ noun }}",
  "{{ a_noun }} is the {{ noun }} of {{ a_noun }}",
  "{{ an_adjective }} {{ noun }}'s {{ noun }} comes with it the thought that the {{ adjective }} {{ noun }} is {{ a_noun }}",
  "{{ nouns }} are {{ adjective }} {{ nouns }}",
  "{{ adjective }} {{ nouns }} show us how {{ nouns }} can be {{ nouns }}",
  "before {{ nouns }}, {{ nouns }} were only {{ nouns }}",
  "those {{ nouns }} are nothing more than {{ nouns }}",
  "some {{ adjective }} {{ nouns }} are thought of simply as {{ nouns }}",
  "one cannot separate {{ nouns }} from {{ adjective }} {{ nouns }}",
  "the {{ nouns }} could be said to resemble {{ adjective }} {{ nouns }}",
  "{{ an_adjective }} {{ noun }} without {{ nouns }} is truly a {{ noun }} of {{ adjective }} {{ nouns }}",
];

export function randomSentence() {
  const t =
    sentenceTemplates[
      Math.round(Math.random() * (sentenceTemplates.length - 1))
    ];
  return Sentencer.make(t);
}
