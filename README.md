# Fitnuts
Fitness, Wellness, Nutrition

## Prerequisites
1. Apache Server / PHP ^7.0
2. Node ^10 
3. MySQL
4. Composer


## Step to install
 
Download/Clone Repo and Navigate to Project Directory

## Setup Clientside

1. cd into FitnutsLatestFrontendCode

2. Install Dependencies

```
npm install
```

3. Serve Application

```
ng serve
```
4. Configure environment to point to Server Api



## Setup ServerSide

1. cd into serverCodeLatest

```
composer install
```

2. Upload test.sql in Project Directory to mysql
3. Connect to Database with config/application.php

4. Serve Application

```
php -S localhost:[port] -t public public/index.php
```

