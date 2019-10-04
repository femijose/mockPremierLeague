

This is an API that serves the latest scores of fixtures of matches in a “**Mock Premier League**”

It has methods that allow
  - signup/login of normal and admin users
  - management of teams (add, remove, edit, view)
  - creation fixtures (add, remove, edit, view) 
  - Generation unique links for fixture upon creation
  - viewing completed fixtures
  - viewing pending fixtures
  - robust search  of fixtures/teams

The API was developed to ensure
- addition,removal and editing of team and fixture is done only by an admin user
- Only the search API should be available to the public.


Other features includes:
- use of redis as  session store.
- Authentication and Authorization for admin and user accounts using `Bearer token` and `JWT`.
- Thorough documentation using POSTMAN.
- e2e tests and use of `Jest` for tests.
- `web caching` API endpoints using `Redis`.
- Implementing `rate limiting` for user account API access.


The API should is hosted on http://femijose-mpl.herokuapp.com
API Documentation - https://documenter.getpostman.com/view/912151/SVtR1VVDa


## Tools/Stack

- NodeJs (JavaScript or TypeScript)
- MongoDB
- Redis
- POSTMAN
- Jest
- Express


=




