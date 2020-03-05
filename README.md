# GitMoney

## Deployed URL
https://project-2-uncc.herokuapp.com/search-historical

## Description:
A Full-Stack application that allows users to interact with live and historical stock data in a friendly and visual way including charts and tables. View current and past data about stock(s) that a user is interested in, sorted by daily, weekly, or monthly tracking. View historical data for years of information. Or make a dashboard with your favorited stocks with custom notes and minute-to-minute charts.

## Functionality/Pages

- Dashboard: Add stocks with notes so that you can pull its live graph onto the screen.

- Live Search: Search specific stocks to get current data about their status, based on daily, weekly, or monthly periods.

- Historic Search: Search specific stocks to see data over periods of time that the user sets.


## Technologies:
- Node.js
- Jquery
- SQL
- C3.js
- Travis CI
- Handlebars
- Bootstrap
- 

## Packages:
- Express
- axios
- mysql
- sequelize

## Walkthrough

This guide will help walk through the features of the GitMoney web application

### Landing Page


The user has 3 options to navigate to 
* Home
* Search (Live/Historical)
* Dashboard

![GiMoney Landing](/Images/landing.JPG)

### Dashboard

* In the Dashboard the User has the ability to search for a stock ticker symbol to add to their favorites with an added note of their choice
* Once the Symbol is added to Favorites, Clicking on the Symbol will add a current daily chart of that stocks performance
* The user can add or remove as many daily charts as they would like

![GiMoney Dash](/Images/dash.JPG)
![GiMoney Landing](/Images/perform.JPG)

### Live Search

* The live search function allows a user to view the performace of any stock over 100 days, 100 weeks, or 100 months
* This search shows the closing values of the stocks over that timeframe
* A Table with periodical information is provided below the chart that is dynamically created

![GiMoney Live](/Images/live1.JPG)
![GiMoney Live2](/Images/live2.JPG)

### Historical Search

* A small subset of the S&P 500 stocks has been uploaded to our Database to allow a User to view past performance of these stocks
* The user may select any of these symbols and select any 'Valid' date range to produce a chart of that symbols performance
* Open, Close, High, Low, and Volume values are provided in the table and the chart created from that symbol
* The user can hide/reveal any of these values from the chart that is created
* Meta results from the time period selected are also provided below the chart and above the table

![GiMoney Historical](/Images/hist1.JPG)
![GiMoney Historical](/Images/hist2.JPG)
![GiMoney Historical](/Images/hist3.JPG)


