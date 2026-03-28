/// <reference types = "Cypress"/>

describe('Get Jobs Test', () => {

  it('get all jobs', () => {
    cy.request('/').then((response) => {

      console.log(response),
        expect(response.status).equal(200),
        expect(response.statusText).equal("OK")
    })
  })

  it('verify jobs result list', () => {
    cy.request('/').then((response) => {

      console.log(response.body.content),
        expect(response.body.content).not.empty
    })
  })

  it('job listing has all the details', () => {
    cy.request('/').then((response) => {
      var result = response.body.content[1]
      console.log(result)
      expect(result).have.property("id")
      expect(result.id).equal("65428d7c3f7d791f7b3e7b62")

      expect(result).have.property("location")
      expect(result.location).equal("New Guiseppe")

      expect(result).have.property("position")
      expect(result.position).equal("Global Web Designer")

      expect(result).have.property("link")
      expect(result.link).contain("http")
    })
  })

  it('search by location', () => {
    cy.request('/?location=Toronto').then((response) => {
      let resultsList = response.body.content
      console.log(resultsList)
      expect(response.status).equal(200)

      for (let i = 0; i < resultsList.length; i++) {
        expect(resultsList[i].location).contain('Toronto')
      }

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
      expect(response.body.content).to.be.an('array')
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
      expect(response.body.content).to.be.an('array')
    })
  })

  it('search by location and company', () => {
    cy.request('/?location=Toronto&company=Apple').then((response) => {
      expect(response.status).equal(200)

      const hasRelevant = response.body.content.some(item =>
        item.location.includes('Toronto') ||
        item.company.toLowerCase().includes('apple')
      )

      expect(hasRelevant).to.be.true
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

})