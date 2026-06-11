const yesOrNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]

const difficultyOptions = [
  {
    label: 'Appropriate',
    value: 'appropriate',
  },
  {
    label: 'Too difficult',
    value: 'difficult',
  },
  {
    label: 'Too simple',
    value: 'simple',
  },
]

const hasIssuesOptions = [
  {
    label: 'There are NO content-related issues',
    value: false,
  },
  {
    label: 'There are content-related issues  ',
    value: true,
  },
]

const distractorsOptions = [
  {
    value: 'appropriate',
    label: 'The distractors are appropriate',
  },
  {
    value: 'multipleDistractors',
    label:
      'There are multiple correct answers, or it is not clear which answer is correct',
  },
  {
    value: 'externalKnowledge',
    label:
      'Knowledge outside the assessed LO is needed to eliminate distractors',
  },
  {
    value: 'misconceptions',
    label: 'Not all distractors address common misconceptions of the content',
  },
]

const feedbackEvaluationOptions = [
  {
    label: 'There are NO issues related to the feedback',
    value: 'noIssues',
  },
  {
    label: 'There are issues with the feedback',
    value: 'hasIssues',
  },
]

const concernsOptions = [
  {
    label: 'No clarity, grammatical, structural, or other concerns',
    value: 'noConcerns',
  },
  {
    label: 'Clarity, concerns',
    value: 'clarity',
  },
  {
    label: 'Grammatical or structural concerns',
    value: 'grammatical',
  },
  {
    label: 'Other item construction concerns',
    value: 'other',
  },
]

const renderAnswer = (options, answer) => {
  return options.find(o => o.value === answer)?.label
}

const renderAnswersList = (options, answers) => {
  const labels = options
    .filter(o => answers.indexOf(o.value) >= 0)
    .map(a => `<li>${a.label}</li>`)
    .join('')

  return `<ul>${labels}</ul>`
}

const parseReview = responses => {
  // step 1
  let content = `
        <p><strong>Did you answer the item correctly?</strong></p>
        <p>${renderAnswer(yesOrNoOptions, responses.answeredCorrectly)}</p>

        <p><strong>Were there any barriers or points of confusion for you in answering this item?</strong></p>
        <p>${responses.barriers || '-'}</p>

        <p><strong>In the context of your biology course, the content assessed by this item is:</strong></p>
        <p>${renderAnswer(difficultyOptions, responses.difficulty)}</p>
        
        <p><strong>Evaluating content</strong></p>
        <p>${renderAnswer(hasIssuesOptions, responses.hasIssues)}</p>
    `

  // step 2 (also the last item above)
  if (responses.hasIssues) {
    content += `        
        <p><strong>You identified content-related issues; please explain in greater detail:</strong></p>
        <p>${responses.issuesDetails}</p>
      `
  } else {
    // step 3
    if (responses.distractors) {
      content += `
            <p><strong>Evaluating item distractors:</strong></p>
            <p>${renderAnswer(distractorsOptions, responses.distractors)}</p>
        `
    }

    content += `
          <p><strong>Evaluating the feedback for the correct and incorrect options.</strong></p>
          <p>${renderAnswer(
            feedbackEvaluationOptions,
            responses.feedbackEvaluation,
          )}</p>
      `

    if (responses.feedbackEvaluation === 'hasIssues') {
      content += `
            <p><strong>You identified feedback-related issues; please explain the issue(s) in greater detail:</strong></p>
            <p>${responses.feedbackIssuesDetails}</p>
        `
    }

    // step 4
    content += `
          <p><strong>The construction of this item has:</strong></p>
          <p>${renderAnswersList(concernsOptions, responses.concerns)}</p>
      `

    if (responses.concerns.includes('clarity')) {
      content += `
            <p><strong>If clarity-related issue(s) are noted, please explain in detail.</strong></p>
            <p>${responses.clarityConcerns}</p>
        `
    }

    if (responses.concerns.includes('grammatical')) {
      content += `
            <p><strong>If grammatical or structural issues are noted, please explain in detail</strong></p>
            <p>${responses.grammaticalConcerns}</p>
        `
    }

    if (responses.concerns.includes('other')) {
      content += `
            <p><strong>If other item construction concerns are noted, please explain in detail.</strong></p>
            <p>${responses.otherConcerns}</p>
        `
    }

    content += `
          <p><strong>Do you have any additional suggestions for improving the item as written?</strong></p>
          <p>${responses.suggestions || '-'}</p>
      `
  }

  return content
}

module.exports = parseReview
