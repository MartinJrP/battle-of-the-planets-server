import { expect } from 'chai'

import RoundSession from './../src/GameObjects/RoundSession'
import Round from './../src/GameObjects/Round'

describe.only('RoundSession', function() {

  it('should determine who clicked first', function() {
    let round = {
      num: 1,
      teamOnePlayerNum: 1,
      teamTwoPlayerNum: 2,
    
      questionIndex: 0
    }
    let session = new RoundSession(round)

    session.teamOneResponseTimestamp = (new Date).getTime() + 1
    session.teamTwoResponseTimestamp = (new Date).getTime()

    expect(session.teamWhoShouldRespond()).to.equal(1)
  })

  it('should return null if both players were yet to tap.', function () {
    let round = {
      num: 1,
      teamOnePlayerNum: 1,
      teamTwoPlayerNum: 2,
    
      questionIndex: 0
    }
    let session = new RoundSession(round)

    session.teamTwoResponseTimestamp = (new Date).getTime()

    expect(session.teamWhoShouldRespond()).to.be.null
  })

})