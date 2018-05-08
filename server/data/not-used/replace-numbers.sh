#!/usr/bin/env bash

sed -i 's/\([0-9]\)-\([0-9]\)/\1 to \2/g' *.txt
git commit -m "Corpus: replace dash in year ranges" -a
sed -i 's/\([0-9]\)\%/\1 percent/g' *.txt
git commit -m "Corpus: replace percent symbol" -a

sed -i 's/\(^\|[ ’:-]\)14474\([ .?!,%:-]\|$\)/\1one-four-four-seven-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)12188\([ .?!,%:-]\|$\)/\1one-two-one-eight-eight\2/g' *.txt
git commit -m "Corpus: replace numbers 1xxxx" -a

sed -i 's/\(^\|[ ’:-]\)9344\([ .?!,%:-]\|$\)/\1nine-three-four-four\2/g' *.txt
git commit -m "Corpus: replace numbers 9xxx" -a

sed -i 's/\(^\|[ ’:-]\)7065\([ .?!,%:-]\|$\)/\1seven-oh-six-five\2/g' *.txt
git commit -m "Corpus: replace numbers 7xxx" -a

sed -i 's/\(^\|[ ’:-]\)5311\([ .?!,%:-]\|$\)/\1five thousand, three hundred and eleven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)5132\([ .?!,%:-]\|$\)/\1five thousand, one hundred and thirty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)5050\([ .?!,%:-]\|$\)/\1five thousand and fifty\2/g' *.txt
git commit -m "Corpus: replace numbers 5xxx" -a

sed -i 's/\(^\|[ ’:-]\)4813\([ .?!,%:-]\|$\)/\1four-eight-one-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)4315\([ .?!,%:-]\|$\)/\1four-three-one-five\2/g' *.txt
git commit -m "Corpus: replace numbers 4xxx" -a

sed -i 's/\(^\|[ ’:-]\)3618\([ .?!,%:-]\|$\)/\1three-six-one-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)3443\([ .?!,%:-]\|$\)/\1three-four-four-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)3442\([ .?!,%:-]\|$\)/\1three-four-four-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)3113\([ .?!,%:-]\|$\)/\1three-one-one-three\2/g' *.txt
git commit -m "Corpus: replace numbers 3xxx" -a

sed -i 's/\(^\|[ ’:-]\)2824\([ .?!,%:-]\|$\)/\1two thousand, eight hundred twenty-four\2/g' *.txt
git commit -m "Corpus: replace numbers 28xx" -a

sed -i 's/\(^\|[ ’:-]\)2150\([ .?!,%:-]\|$\)/\1two thousand, one hundred fifty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2120\([ .?!,%:-]\|$\)/\1two thousand, one hundred twenty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2112\([ .?!,%:-]\|$\)/\1two thousand, one hundred twelve\2/g' *.txt
git commit -m "Corpus: replace numbers 21xx" -a

sed -i 's/\(^\|[ ’:-]\)2040\([ .?!,%:-]\|$\)/\1two thousand and forty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2039\([ .?!,%:-]\|$\)/\1two thousand and thirty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2038\([ .?!,%:-]\|$\)/\1two thousand and thirty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2037\([ .?!,%:-]\|$\)/\1two thousand and thirty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2036\([ .?!,%:-]\|$\)/\1two thousand and thirty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2035\([ .?!,%:-]\|$\)/\1two thousand and thirty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2034\([ .?!,%:-]\|$\)/\1two thousand and thirty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2033\([ .?!,%:-]\|$\)/\1two thousand and thirty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2032\([ .?!,%:-]\|$\)/\1two thousand and thirty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2031\([ .?!,%:-]\|$\)/\1two thousand and thirty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2030\([ .?!,%:-]\|$\)/\1two thousand and thirty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2029\([ .?!,%:-]\|$\)/\1two thousand and twenty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2028\([ .?!,%:-]\|$\)/\1two thousand and twenty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2027\([ .?!,%:-]\|$\)/\1two thousand and twenty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2026\([ .?!,%:-]\|$\)/\1two thousand and twenty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2025\([ .?!,%:-]\|$\)/\1two thousand and twenty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2024\([ .?!,%:-]\|$\)/\1two thousand and twenty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2023\([ .?!,%:-]\|$\)/\1two thousand and twenty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2022\([ .?!,%:-]\|$\)/\1two thousand and twenty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2021\([ .?!,%:-]\|$\)/\1two thousand and twenty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2020\([ .?!,%:-]\|$\)/\1two thousand and twenty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2019\([ .?!,%:-]\|$\)/\1two thousand and nineteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2018\([ .?!,%:-]\|$\)/\1two thousand and eighteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2017\([ .?!,%:-]\|$\)/\1two thousand and seventeen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2016\([ .?!,%:-]\|$\)/\1two thousand and sixteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2015\([ .?!,%:-]\|$\)/\1two thousand and fifteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2014\([ .?!,%:-]\|$\)/\1two thousand and fourteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2013\([ .?!,%:-]\|$\)/\1two thousand and thirteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2012\([ .?!,%:-]\|$\)/\1two thousand and twelve\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2011\([ .?!,%:-]\|$\)/\1two thousand and eleven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2010\([ .?!,%:-]\|$\)/\1two thousand and ten\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2009\([ .?!,%:-]\|$\)/\1two thousand and nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2008\([ .?!,%:-]\|$\)/\1two thousand and eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2007\([ .?!,%:-]\|$\)/\1two thousand and seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2006\([ .?!,%:-]\|$\)/\1two thousand and six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2005\([ .?!,%:-]\|$\)/\1two thousand and five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2004\([ .?!,%:-]\|$\)/\1two thousand and four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2003\([ .?!,%:-]\|$\)/\1two thousand and three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2002\([ .?!,%:-]\|$\)/\1two thousand and two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2001\([ .?!,%:-]\|$\)/\1two thousand and one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2000\([ .?!,%:-]\|$\)/\1two thousand\2/g' *.txt
git commit -m "Corpus: replace numbers 20xx" -a

sed -i 's/\(^\|[ ’:-]\)1999\([ .?!,%:-]\|$\)/\1nineteen ninety-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1998\([ .?!,%:-]\|$\)/\1nineteen ninety-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1997\([ .?!,%:-]\|$\)/\1nineteen ninety-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1996\([ .?!,%:-]\|$\)/\1nineteen ninety-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1995\([ .?!,%:-]\|$\)/\1nineteen ninety-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1994\([ .?!,%:-]\|$\)/\1nineteen ninety-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1993\([ .?!,%:-]\|$\)/\1nineteen ninety-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1992\([ .?!,%:-]\|$\)/\1nineteen ninety-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1991\([ .?!,%:-]\|$\)/\1nineteen ninety-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1990\([ .?!,%:-]\|$\)/\1nineteen ninety\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1989\([ .?!,%:-]\|$\)/\1nineteen eighty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1988\([ .?!,%:-]\|$\)/\1nineteen eighty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1987\([ .?!,%:-]\|$\)/\1nineteen eighty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1986\([ .?!,%:-]\|$\)/\1nineteen eighty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1985\([ .?!,%:-]\|$\)/\1nineteen eighty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1984\([ .?!,%:-]\|$\)/\1nineteen eighty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1983\([ .?!,%:-]\|$\)/\1nineteen eighty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1982\([ .?!,%:-]\|$\)/\1nineteen eighty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1981\([ .?!,%:-]\|$\)/\1nineteen eighty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1980\([ .?!,%:-]\|$\)/\1nineteen eighty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1979\([ .?!,%:-]\|$\)/\1nineteen seventy-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1978\([ .?!,%:-]\|$\)/\1nineteen seventy-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1977\([ .?!,%:-]\|$\)/\1nineteen seventy-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1976\([ .?!,%:-]\|$\)/\1nineteen seventy-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1975\([ .?!,%:-]\|$\)/\1nineteen seventy-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1974\([ .?!,%:-]\|$\)/\1nineteen seventy-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1973\([ .?!,%:-]\|$\)/\1nineteen seventy-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1972\([ .?!,%:-]\|$\)/\1nineteen seventy-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1971\([ .?!,%:-]\|$\)/\1nineteen seventy-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1970\([ .?!,%:-]\|$\)/\1nineteen seventy\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1969\([ .?!,%:-]\|$\)/\1nineteen sixty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1968\([ .?!,%:-]\|$\)/\1nineteen sixty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1967\([ .?!,%:-]\|$\)/\1nineteen sixty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1966\([ .?!,%:-]\|$\)/\1nineteen sixty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1965\([ .?!,%:-]\|$\)/\1nineteen sixty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1964\([ .?!,%:-]\|$\)/\1nineteen sixty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1963\([ .?!,%:-]\|$\)/\1nineteen sixty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1962\([ .?!,%:-]\|$\)/\1nineteen sixty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1961\([ .?!,%:-]\|$\)/\1nineteen sixty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1960\([ .?!,%:-]\|$\)/\1nineteen sixty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1959\([ .?!,%:-]\|$\)/\1nineteen fifty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1958\([ .?!,%:-]\|$\)/\1nineteen fifty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1957\([ .?!,%:-]\|$\)/\1nineteen fifty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1956\([ .?!,%:-]\|$\)/\1nineteen fifty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1955\([ .?!,%:-]\|$\)/\1nineteen fifty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1954\([ .?!,%:-]\|$\)/\1nineteen fifty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1953\([ .?!,%:-]\|$\)/\1nineteen fifty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1952\([ .?!,%:-]\|$\)/\1nineteen fifty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1951\([ .?!,%:-]\|$\)/\1nineteen fifty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1950\([ .?!,%:-]\|$\)/\1nineteen fifty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1945\([ .?!,%:-]\|$\)/\1nineteen forty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1938\([ .?!,%:-]\|$\)/\1nineteen thirty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1933\([ .?!,%:-]\|$\)/\1nineteen thirty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1923\([ .?!,%:-]\|$\)/\1nineteen twenty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1920\([ .?!,%:-]\|$\)/\1nineteen twenty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1918\([ .?!,%:-]\|$\)/\1nineteen eighteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1915\([ .?!,%:-]\|$\)/\1nineteen fifteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1914\([ .?!,%:-]\|$\)/\1nineteen fourteen\2/g' *.txt
git commit -m "Corpus: replace numbers 19xx" -a

sed -i 's/\(^\|[ ’:-]\)1889\([ .?!,%:-]\|$\)/\1eighteen eighty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1844\([ .?!,%:-]\|$\)/\1eighteen forty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1800\([ .?!,%:-]\|$\)/\1eighteen hundred\2/g' *.txt
git commit -m "Corpus: replace numbers 18xx" -a

sed -i 's/\(^\|[ ’:-]\)1634\([ .?!,%:-]\|$\)/\1sixteen thirty-four\2/g' *.txt
git commit -m "Corpus: replace numbers 16xx" -a

sed -i 's/\(^\|[ ’:-]\)1299\([ .?!,%:-]\|$\)/\1one-two-nine-nine\2/g' *.txt
git commit -m "Corpus: replace numbers 12xx" -a

sed -i 's/\(^\|[ ’:-]\)1127\([ .?!,%:-]\|$\)/\1eleven twenty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1102\([ .?!,%:-]\|$\)/\1one-one-oh-two\2/g' *.txt
git commit -m "Corpus: replace numbers 11xx" -a

sed -i 's/\(^\|[ ’:-]\)1011\([ .?!,%:-]\|$\)/\1one thousand and eleven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1000\([ .?!,%:-]\|$\)/\1one thousand\2/g' *.txt
git commit -m "Corpus: replace numbers 10xx" -a

sed -i 's/\(^\|[ ’:-]\)969\([ .?!,%:-]\|$\)/\1nine hundred sixty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)920\([ .?!,%:-]\|$\)/\1nine hundred twenty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)916\([ .?!,%:-]\|$\)/\1nine hundred sixteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)911\([ .?!,%:-]\|$\)/\1nine hundred eleven\2/g' *.txt
git commit -m "Corpus: replace numbers 9xx" -a

sed -i 's/\(^\|[ ’:-]\)853\([ .?!,%:-]\|$\)/\1eight hundred fifty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)847\([ .?!,%:-]\|$\)/\1eight hundred forty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)807\([ .?!,%:-]\|$\)/\1eight hundred seven\2/g' *.txt
git commit -m "Corpus: replace numbers 8xx" -a

sed -i 's/\(^\|[ ’:-]\)745\([ .?!,%:-]\|$\)/\1seven hundred forty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)721\([ .?!,%:-]\|$\)/\1seven hundred twenty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)701\([ .?!,%:-]\|$\)/\1seven hundred one\2/g' *.txt
git commit -m "Corpus: replace numbers 7xx" -a

sed -i 's/\(^\|[ ’:-]\)697\([ .?!,%:-]\|$\)/\1six hundred ninety-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)661\([ .?!,%:-]\|$\)/\1six hundred sixty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)625\([ .?!,%:-]\|$\)/\1six hundred twenty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)600\([ .?!,%:-]\|$\)/\1six hundred\2/g' *.txt
git commit -m "Corpus: replace numbers 6xx" -a

sed -i 's/\(^\|[ ’:-]\)541\([ .?!,%:-]\|$\)/\1five hundred forty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)535\([ .?!,%:-]\|$\)/\1five hundred thirty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)504\([ .?!,%:-]\|$\)/\1five hundred four\2/g' *.txt
git commit -m "Corpus: replace numbers 5xx" -a

sed -i 's/\(^\|[ ’:-]\)406\([ .?!,%:-]\|$\)/\1four hundred six\2/g' *.txt
git commit -m "Corpus: replace numbers 4xx" -a

sed -i 's/\(^\|[ ’:-]\)365\([ .?!,%:-]\|$\)/\1three hundred sixty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)360\([ .?!,%:-]\|$\)/\1three hundred sixty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)345\([ .?!,%:-]\|$\)/\1three hundred forty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)333\([ .?!,%:-]\|$\)/\1three hundred thirty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)330\([ .?!,%:-]\|$\)/\1three hundred thirty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)320\([ .?!,%:-]\|$\)/\1three hundred twenty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)308\([ .?!,%:-]\|$\)/\1three hundred eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)303\([ .?!,%:-]\|$\)/\1three hundred three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)302\([ .?!,%:-]\|$\)/\1three hundred two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)300\([ .?!,%:-]\|$\)/\1three hundred\2/g' *.txt
git commit -m "Corpus: replace numbers 3xx" -a

sed -i 's/\(^\|[ ’:-]\)281\([ .?!,%:-]\|$\)/\1two hundred eighty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)257\([ .?!,%:-]\|$\)/\1two hundred fifty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)253\([ .?!,%:-]\|$\)/\1two hundred fifty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)241\([ .?!,%:-]\|$\)/\1two hundred forty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)236\([ .?!,%:-]\|$\)/\1two hundred thirty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)213\([ .?!,%:-]\|$\)/\1two hundred thirteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)210\([ .?!,%:-]\|$\)/\1two hundred ten\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)207\([ .?!,%:-]\|$\)/\1two hundred seven\2/g' *.txt
git commit -m "Corpus: replace numbers 2xx" -a

sed -i 's/\(^\|[ ’:-]\)190\([ .?!,%:-]\|$\)/\1one hundred ninety\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)188\([ .?!,%:-]\|$\)/\1one hundred eighty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)180\([ .?!,%:-]\|$\)/\1one hundred eighty\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)175\([ .?!,%:-]\|$\)/\1one hundred seventy-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)170\([ .?!,%:-]\|$\)/\1one hundred seventy\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)165\([ .?!,%:-]\|$\)/\1one hundred sixty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)163\([ .?!,%:-]\|$\)/\1one hundred sixty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)161\([ .?!,%:-]\|$\)/\1one hundred sixty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)157\([ .?!,%:-]\|$\)/\1one hundred fifty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)156\([ .?!,%:-]\|$\)/\1one hundred fifty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)145\([ .?!,%:-]\|$\)/\1one hundred forty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)141\([ .?!,%:-]\|$\)/\1one hundred forty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)138\([ .?!,%:-]\|$\)/\1one hundred thirty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)135\([ .?!,%:-]\|$\)/\1one hundred thirty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)134\([ .?!,%:-]\|$\)/\1one hundred thirty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)131\([ .?!,%:-]\|$\)/\1one hundred thirty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)129\([ .?!,%:-]\|$\)/\1one hundred twenty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)122\([ .?!,%:-]\|$\)/\1one hundred twenty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)119\([ .?!,%:-]\|$\)/\1one hundred nineteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)116\([ .?!,%:-]\|$\)/\1one hundred sixteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)110\([ .?!,%:-]\|$\)/\1one hundred ten\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)105\([ .?!,%:-]\|$\)/\1one hundred five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)104\([ .?!,%:-]\|$\)/\1one hundred four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)103\([ .?!,%:-]\|$\)/\1one hundred three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)101\([ .?!,%:-]\|$\)/\1one hundred one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)100\([ .?!,%:-]\|$\)/\1one hundred\2/g' *.txt
git commit -m "Corpus: replace numbers 1xx" -a

sed -i 's/\(^\|[ ’:-]\)99\([ .?!,%:-]\|$\)/\1ninety-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)98\([ .?!,%:-]\|$\)/\1ninety-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)97\([ .?!,%:-]\|$\)/\1ninety-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)96\([ .?!,%:-]\|$\)/\1ninety-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)95\([ .?!,%:-]\|$\)/\1ninety-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)94\([ .?!,%:-]\|$\)/\1ninety-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)93\([ .?!,%:-]\|$\)/\1ninety-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)91\([ .?!,%:-]\|$\)/\1ninety-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)90\([ .?!,%:-]\|$\)/\1ninety\2/g' *.txt
git commit -m "Corpus: replace numbers 9x" -a

sed -i 's/\(^\|[ ’:-]\)89\([ .?!,%:-]\|$\)/\1eighty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)88\([ .?!,%:-]\|$\)/\1eighty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)84\([ .?!,%:-]\|$\)/\1eighty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)81\([ .?!,%:-]\|$\)/\1eighty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)80\([ .?!,%:-]\|$\)/\1eighty\2/g' *.txt
git commit -m "Corpus: replace numbers 8x" -a

sed -i 's/\(^\|[ ’:-]\)79\([ .?!,%:-]\|$\)/\1seventy-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)78\([ .?!,%:-]\|$\)/\1seventy-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)75\([ .?!,%:-]\|$\)/\1seventy-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)74\([ .?!,%:-]\|$\)/\1seventy-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)72\([ .?!,%:-]\|$\)/\1seventy-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)71\([ .?!,%:-]\|$\)/\1seventy-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)70\([ .?!,%:-]\|$\)/\1seventy\2/g' *.txt
git commit -m "Corpus: replace numbers 7x" -a

sed -i 's/\(^\|[ ’:-]\)69\([ .?!,%:-]\|$\)/\1sixty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)66\([ .?!,%:-]\|$\)/\1sixty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)64\([ .?!,%:-]\|$\)/\1sixty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)63\([ .?!,%:-]\|$\)/\1sixty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)61\([ .?!,%:-]\|$\)/\1sixty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)60\([ .?!,%:-]\|$\)/\1sixty\2/g' *.txt
git commit -m "Corpus: replace numbers 6x" -a

sed -i 's/\(^\|[ ’:-]\)59\([ .?!,%:-]\|$\)/\1fifty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)58\([ .?!,%:-]\|$\)/\1fifty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)57\([ .?!,%:-]\|$\)/\1fifty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)56\([ .?!,%:-]\|$\)/\1fifty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)55\([ .?!,%:-]\|$\)/\1fifty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)54\([ .?!,%:-]\|$\)/\1fifty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)53\([ .?!,%:-]\|$\)/\1fifty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)52\([ .?!,%:-]\|$\)/\1fifty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)51\([ .?!,%:-]\|$\)/\1fifty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)50\([ .?!,%:-]\|$\)/\1fifty\2/g' *.txt
git commit -m "Corpus: replace numbers 5x" -a

sed -i 's/\(^\|[ ’:-]\)49\([ .?!,%:-]\|$\)/\1forty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)48\([ .?!,%:-]\|$\)/\1forty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)47\([ .?!,%:-]\|$\)/\1forty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)46\([ .?!,%:-]\|$\)/\1forty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)45\([ .?!,%:-]\|$\)/\1forty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)44\([ .?!,%:-]\|$\)/\1forty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)43\([ .?!,%:-]\|$\)/\1forty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)42\([ .?!,%:-]\|$\)/\1forty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)41\([ .?!,%:-]\|$\)/\1forty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)40\([ .?!,%:-]\|$\)/\1forty\2/g' *.txt
git commit -m "Corpus: replace numbers 4x" -a

sed -i 's/\(^\|[ ’:-]\)39\([ .?!,%:-]\|$\)/\1thirty-nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)38\([ .?!,%:-]\|$\)/\1thirty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)37\([ .?!,%:-]\|$\)/\1thirty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)36\([ .?!,%:-]\|$\)/\1thirty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)35\([ .?!,%:-]\|$\)/\1thirty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)34\([ .?!,%:-]\|$\)/\1thirty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)33\([ .?!,%:-]\|$\)/\1thirty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)32\([ .?!,%:-]\|$\)/\1thirty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)31\([ .?!,%:-]\|$\)/\1thirty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)30\([ .?!,%:-]\|$\)/\1thirty\2/g' *.txt
git commit -m "Corpus: replace numbers 3x" -a

sed -i 's/\(^\|[ ’:-]\)28\([ .?!,%:-]\|$\)/\1twenty-eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)27\([ .?!,%:-]\|$\)/\1twenty-seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)26\([ .?!,%:-]\|$\)/\1twenty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)25\([ .?!,%:-]\|$\)/\1twenty-five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)24\([ .?!,%:-]\|$\)/\1twenty-four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)23\([ .?!,%:-]\|$\)/\1twenty-three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)22\([ .?!,%:-]\|$\)/\1twenty-two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)21\([ .?!,%:-]\|$\)/\1twenty-one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)20\([ .?!,%:-]\|$\)/\1twenty\2/g' *.txt
git commit -m "Corpus: replace numbers 2x" -a

sed -i 's/\(^\|[ ’:-]\)19\([ .?!,%:-]\|$\)/\1nineteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)18\([ .?!,%:-]\|$\)/\1eighteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)17\([ .?!,%:-]\|$\)/\1seventeen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)16\([ .?!,%:-]\|$\)/\1sixteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)15\([ .?!,%:-]\|$\)/\1fifteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)14\([ .?!,%:-]\|$\)/\1fourteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)13\([ .?!,%:-]\|$\)/\1thirteen\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)12\([ .?!,%:-]\|$\)/\1twelve\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)11\([ .?!,%:-]\|$\)/\1eleven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)10\([ .?!,%:-]\|$\)/\1ten\2/g' *.txt
git commit -m "Corpus: replace numbers 1x" -a

sed -i 's/\(^\|[ ’:-]\)9\([ .?!,%:-]\|$\)/\1nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)8\([ .?!,%:-]\|$\)/\1eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)7\([ .?!,%:-]\|$\)/\1seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)6\([ .?!,%:-]\|$\)/\1six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)5\([ .?!,%:-]\|$\)/\1five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)4\([ .?!,%:-]\|$\)/\1four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)3\([ .?!,%:-]\|$\)/\1three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2\([ .?!,%:-]\|$\)/\1two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1\([ .?!,%:-]\|$\)/\1one\2/g' *.txt
git commit -m "Corpus: replace numbers x" -a

sed -i 's/\(^\|[ ’:-]\)0\([ .?!,%:-]\|$\)/\1zero\2/g' *.txt
git commit -m "Corpus: replace numbers 0" -a

sed -i 's/\(^\|[ ’:-]\)0095\([ .?!,%:-]\|$\)/\1ninety-five\2/g' *.txt
git commit -m "Corpus: replace numbers 00xx" -a

sed -i 's/\(^\|[ ’:-]\)046\([ .?!,%:-]\|$\)/\1forty-six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)007\([ .?!,%:-]\|$\)/\1seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)006\([ .?!,%:-]\|$\)/\1six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)003\([ .?!,%:-]\|$\)/\1three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)000\([ .?!,%:-]\|$\)/\1zero\2/g' *.txt
git commit -m "Corpus: replace numbers 0xx" -a

sed -i 's/\(^\|[ ’:-]\)09\([ .?!,%:-]\|$\)/\1nine\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)08\([ .?!,%:-]\|$\)/\1eight\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)07\([ .?!,%:-]\|$\)/\1seven\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)06\([ .?!,%:-]\|$\)/\1six\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)05\([ .?!,%:-]\|$\)/\1five\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)04\([ .?!,%:-]\|$\)/\1four\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)03\([ .?!,%:-]\|$\)/\1three\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)02\([ .?!,%:-]\|$\)/\1two\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)01\([ .?!,%:-]\|$\)/\1one\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)00\([ .?!,%:-]\|$\)/\1zero\2/g' *.txt
git commit -m "Corpus: replace numbers 0x" -a

sed -i 's/\(^\|[ ’:-]\)1st\([ .?!,%:-]\|$\)/\1first\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2nd\([ .?!,%:-]\|$\)/\1second\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)3rd\([ .?!,%:-]\|$\)/\1third\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)4th\([ .?!,%:-]\|$\)/\1fourth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)5th\([ .?!,%:-]\|$\)/\1fifth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)6th\([ .?!,%:-]\|$\)/\1sixth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)7th\([ .?!,%:-]\|$\)/\1seventh\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)8th\([ .?!,%:-]\|$\)/\1eigth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)9th\([ .?!,%:-]\|$\)/\1nineth\2/g' *.txt
git commit -m "Corpus: replace ordinals 1st/2nd/xth" -a

sed -i 's/\(^\|[ ’:-]\)10th\([ .?!,%:-]\|$\)/\1tenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)11th\([ .?!,%:-]\|$\)/\1eleventh\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)12th\([ .?!,%:-]\|$\)/\1twelveth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)13th\([ .?!,%:-]\|$\)/\1thirteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)14th\([ .?!,%:-]\|$\)/\1fourteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)15th\([ .?!,%:-]\|$\)/\1fifteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)16th\([ .?!,%:-]\|$\)/\1sixteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)17th\([ .?!,%:-]\|$\)/\1seventeenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)18th\([ .?!,%:-]\|$\)/\1eighteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)19th\([ .?!,%:-]\|$\)/\1nineteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)20th\([ .?!,%:-]\|$\)/\1twentieth\2/g' *.txt
git commit -m "Corpus: replace ordinals 1xth" -a

sed -i 's/\(^\|[ ’:-]\)21st\([ .?!,%:-]\|$\)/\1twenty-first\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)22nd\([ .?!,%:-]\|$\)/\1twenty-second\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)23rd\([ .?!,%:-]\|$\)/\1twenty-third\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)24th\([ .?!,%:-]\|$\)/\1twenty-fourth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)25th\([ .?!,%:-]\|$\)/\1twenty-fifth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)26th\([ .?!,%:-]\|$\)/\1twenty-sixth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)27th\([ .?!,%:-]\|$\)/\1twenty-seventh\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)28th\([ .?!,%:-]\|$\)/\1twenty-eigth\2/g' *.txt
git commit -m "Corpus: replace ordinals 21st/22nd/2xth" -a

sed -i 's/\(^\|[ ’:-]\)30th\([ .?!,%:-]\|$\)/\1thirtieth\2/g' *.txt
git commit -m "Corpus: replace ordinals 31st/32nd/3xth" -a

sed -i 's/\(^\|[ ’:-]\)55th\([ .?!,%:-]\|$\)/\1fifty-fifth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)58th\([ .?!,%:-]\|$\)/\1fifty-eigth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)59th\([ .?!,%:-]\|$\)/\1fifty-nineth\2/g' *.txt
git commit -m "Corpus: replace ordinals 51st/52nd/5xth" -a

sed -i 's/\(^\|[ ’:-]\)69th\([ .?!,%:-]\|$\)/\1sixty-nineth\2/g' *.txt
git commit -m "Corpus: replace ordinals 61st/62nd/6xth" -a

sed -i 's/\(^\|[ ’:-]\)72nd\([ .?!,%:-]\|$\)/\1seventy-second\2/g' *.txt
git commit -m "Corpus: replace ordinals 71st/72nd/7xth" -a

sed -i 's/\(^\|[ ’:-]\)88th\([ .?!,%:-]\|$\)/\1eighty-eigth\2/g' *.txt
git commit -m "Corpus: replace ordinals 81st/82nd/8xth" -a

sed -i 's/\(^\|[ ’:-]\)90th\([ .?!,%:-]\|$\)/\1ninetieth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)96th\([ .?!,%:-]\|$\)/\1ninety-sixth\2/g' *.txt
git commit -m "Corpus: replace ordinals 91st/92nd/9xth" -a

sed -i 's/\(^\|[ ’:-]\)105th\([ .?!,%:-]\|$\)/\1one hundred and fifth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)116th\([ .?!,%:-]\|$\)/\1one hundred and sixteenth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)135th\([ .?!,%:-]\|$\)/\1one hundred and thirty-fifth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)138th\([ .?!,%:-]\|$\)/\1one hundred and thirty-eigth\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)207th\([ .?!,%:-]\|$\)/\1two hundred and seventh\2/g' *.txt
git commit -m "Corpus: replace ordinals xxxst/xxxnd/xxxth" -a

sed -i 's/\(^\|[ ’:-]\)00'"'"'\?s\([ .?!,%:-]\|$\)/\1two thousands\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)20s\([ .?!,%:-]\|$\)/\1twenties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)30s\([ .?!,%:-]\|$\)/\1thirties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)40s\([ .?!,%:-]\|$\)/\1fourties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)60s\([ .?!,%:-]\|$\)/\1sixties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)70s\([ .?!,%:-]\|$\)/\1seventies\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)80'"'"'\?s\([ .?!,%:-]\|$\)/\1eighties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)90'"'"'\?s\([ .?!,%:-]\|$\)/\1nineties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1800s\([ .?!,%:-]\|$\)/\1eighteen hundreds\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1950s\([ .?!,%:-]\|$\)/\1nineteen fifties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1960s\([ .?!,%:-]\|$\)/\1nineteen sixties\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)1970s\([ .?!,%:-]\|$\)/\1nineteen seventies\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2000'"'"'\?s\([ .?!,%:-]\|$\)/\1two thousands\2/g' *.txt
sed -i 's/\(^\|[ ’:-]\)2010'"'"'\?s\([ .?!,%:-]\|$\)/\1two thousand and tens\2/g' *.txt
git commit -m "Corpus: replace numbers xx's" -a