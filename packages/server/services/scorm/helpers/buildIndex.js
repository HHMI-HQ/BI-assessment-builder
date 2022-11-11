const buildIndex = (content, answers, feedback, questionIds) => {
  return `
  'use strict'

  const e = React.createElement
	const answers = ${JSON.stringify(answers)}
	const feedback = ${JSON.stringify(feedback)}

  class Index extends React.Component {
		api = null

    constructor(props) {
      super(props)

			try {
				this.api = getAPI()
			} catch(e) {
				alert('Failed to connect to SCORM: ' + e)
				return
			}

      const init = this.api.LMSInitialize('')

      window.addEventListener('unload', () => {
        this.api.LMSFinish('')
      })

      this.state = {
        submitted: false,
        passed: false,
				${questionIds.map((questionId, index) => {
          return `"q${questionId}": []${
            questionIds.length - 1 !== index ? '\n' : ''
          }`
        })}
      }

      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleAnswer = this.handleAnswer.bind(this)
    }

    handleSubmit = () => {
      let score = 0
			let total = 0

			answers.map(container => {
				const userResponses = this.state['q'.concat(container.containerId)]

				if (container.containerType === 'id') {
					if (container.answerType === 'single') {
						container.answers.map(correctAnswerId => {
							total += correctAnswerId.correct ? 1 : 0
							score += userResponses.includes(correctAnswerId.content) ? 1 : 0
						})
					} else {
						const correctAnswers = container.answers.filter(answer => answer.correct)
						const incorrectAnswers = container.answers.filter(answer => !answer.correct)
						total += container.answers.length

						// check if correct are selected
						correctAnswers.map(answer => {
							score += userResponses.includes(answer.content) ? 1 : 0
						})

						// check if incorrect are not selected
						incorrectAnswers.map(answer => {
							score += !userResponses.includes(answer.content) ? 1 : 0
						})
					}
				} else if (container.containerType === 'value') {
					total += 1
					score += userResponses.includes(container.answers[0].content) ? 1 : 0
				} else if (container.containerType === 'essay') {
					total += 1
					score += userResponses.length && userResponses[0].length ? 1 : 0
				}
			})

      const didPass = score === total
      this.setState({ passed: didPass })
      this.api.LMSSetValue('cmi.core.score.raw', score)
      this.api.LMSSetValue('cmi.core.score.min', '0')
      this.api.LMSSetValue('cmi.core.score.max', total.toString())
      // this.api.LMSSetValue("cmi.core.lesson_status", "completed");
      this.api.LMSSetValue('cmi.core.lesson_status', didPass ? 'passed' : 'failed')
      this.api.LMSSetValue('cmi.core.exit', '')
      this.setState({ submitted: true })
    }

    handleAnswer = (event, options = {}) => {
			const {containerId, type} = options

			const id = event.target.id
			const key = event.target.key
			const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

			if (type === 'multi') {
				const selectedValues = this.state['q'.concat(containerId)]
				this.setState({
					['q'.concat(containerId)]: value 
						? [...selectedValues, id]
						: selectedValues.filter(selected => selected !== id)
				})
			} else if (type === 'single') {
				this.setState({
					['q'.concat(containerId)]: [value]
				})
			}

			// this.setState({['q'.concat(id)]: value})
		}

    render = () => {
      if (!this.api) {
        return 'Failed to connect to API'
      }

      return (
        <div>
					{!this.state.submitted &&
						<form onSubmit={this.handleSubmit}>
							${content}
							<input type="submit" value="Submit" />
						</form>
					}
					{this.state.submitted && 
						<div>
							<h1>Feedback</h1>
							<br/>
							{feedback.length > 0 && feedback.map(fb => (<div>
								<div dangerouslySetInnerHTML={{__html: '<h3>'.concat(fb.questionText).concat('</h3>')}} />
								<p class='paragraph'>{fb.feedback}</p>
							</div>))}
							{!feedback.length && (
								<div>
									<h3>There is no feedback to display.</h3>
								</div>
							)}
							<br />
							<p>You can safely exit the test. Your score has been saved.</p>
						</div>
					}
        </div>
      )
    }
  }

	const domContainer = document.querySelector("#contentWrapper");
	const root = ReactDOM.createRoot(domContainer);
	root.render(e(Index));
	`
}

module.exports = buildIndex
