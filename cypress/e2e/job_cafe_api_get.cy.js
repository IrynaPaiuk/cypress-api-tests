/// <reference types="Cypress" />

describe('Get Jobs Test', () => {

  it('get all jobs', () => {
    cy.request('/').then((response) => {

      console.log(response)

      expect(response.status).equal(200)
      expect(response.statusText).equal("OK")
    })
  })

  it('verify jobs result list', () => {
    cy.request('/').then((response) => {

      console.log(response.body.content)

      expect(response.body.content).to.be.an('array').and.not.be.empty
    })
  })

  it('job listing has all the details', () => {
    cy.request('/').then((response) => {

      const result = response.body.content[0]

      console.log(result)

      expect(result).to.have.property("id")
      expect(result.id).to.be.a("string").and.not.be.empty

      expect(result).to.have.property("location")
      expect(result.location).to.be.a("string").and.not.be.empty

      expect(result).to.have.property("position")
      expect(result.position).to.be.a("string").and.not.be.empty

      expect(result).to.have.property("link")
      expect(result.link).to.include("http")
    })
  })

  it('search by location', () => {
    cy.request('/?location=Toronto').then((response) => {

      const resultsList = response.body.content

      expect(response.status).equal(200)

      resultsList.forEach(item => {
        expect(item.location).to.include('Toronto')
      })
    })
  })

  it('search by id', () => {
    cy.request('/').then((response) => {

      const jobId = response.body.content[0].id

      cy.request(`/?id=${jobId}`).then((res) => {
        expect(res.status).equal(200)
        expect(res.body.content[0].id).equal(jobId)
      })
    })
  })

  it('search by company', () => {
    cy.request('/?company=legion').then((response) => {

      expect(response.status).equal(200)

      response.body.content.forEach(item => {
        expect(item.company.toLowerCase()).to.include('legion')
      })
    })
  })

  it('search by description', () => {
    cy.request('/?description=salary').then((response) => {

      expect(response.status).equal(200)

      const hasRelevant = response.body.content.some(item =>
        item.description.toLowerCase().includes('salary')
      )

      expect(hasRelevant).to.be.true
    })
  })

  it('search by date', () => {
    cy.request('/?date=2021-07-11').then((response) => {

      expect(response.status).equal(200)

      response.body.content.forEach(item => {
        expect(item).to.have.property('date')
        expect(item.date).to.be.a('string')
      })
    })
  })

  it('search by location and company', () => {
    cy.request('/?location=Toronto&company=Apple').then((response) => {

      expect(response.status).equal(200)

      response.body.content.forEach(item => {
        expect(item.location).to.include('Toronto')
        expect(item.company.toLowerCase()).to.include('apple')
      })
    })
  })

  it('verify pagination', () => {
    cy.request('/?page=0&pageSize=5').then((response) => {

      expect(response.status).equal(200)
      expect(response.body.content.length).to.be.lte(5)
    })
  })

  it('invalid query parameter', () => {
    cy.request({
      url: '/?wrongParam=test',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 400])
    })
  })

  it('invalid date format', () => {
    cy.request({
      url: '/?date=invalid-date',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([400, 200])
    })
  })

  it('search by non-existing id', () => {
    cy.request({
      url: '/?id=000000000000000000000000',
      failOnStatusCode: false
    }).then((response) => {

      expect(response.status).to.be.oneOf([200, 204, 404])

      if (response.status === 200) {
        expect(response.body.content).to.be.empty
      }

      if (response.status === 204) {
        expect(response.body).to.be.empty
      }
    })
  })
})