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

const issuesOptions = [
  {
    label: 'There is a factual error in the stem',
    value: 'factualError',
  },
  {
    label: 'Sufficient detail to answer the item is lacking',
    value: 'insufficientDetail',
  },
  {
    label:
      'The content of this item does not incorporate the most up-to-date understanding in the field',
    value: 'outdated',
  },
  {
    label: 'There are other content-related issues',
    value: 'simple',
  },
]

const questionTypesOptions = [
  {
    value: 'essay',
    label: 'Essay',
  },
  {
    value: 'matching',
    label: 'Matching',
  },
  {
    value: 'multipleChoiceSingleCorrect',
    label: 'Multiple Choice',
  },
  {
    value: 'multipleChoice',
    label: 'Multiple Answers',
  },
  {
    value: 'trueFalse',
    label: 'Multiple True / False',
  },
  {
    value: 'numerical',
    label: 'Numerical Answer',
  },
  {
    value: 'trueFalseSingleCorrect',
    label: 'True / False',
  },

  {
    value: 'fillInTheBlank',
    label: 'Fill-in-the-blank',
  },
  {
    value: 'multipleDropdowns',
    label: 'Multiple Dropdowns',
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

const feedbackIssuesOptions = [
  {
    value: 'factualErrors',
    label: 'The feedback contains one or more factual errors',
  },
  {
    value: 'detailsLacking',
    label: 'The feedback lacks details or is not fully explanatory',
  },
  {
    value: 'hintsToCorrectAnswer',
    label:
      'Incorrect response feedback includes information for the correct answer, thereby limiting multiple attempts at the same item',
  },
  {
    value: 'other',
    label: 'There are other feedback-related issues',
  },
]

const concernsOptions = [
  {
    label: 'No clarity, grammatical, structural, or other concerns',
    value: false,
  },
  {
    label: 'Clarity, grammatical, structural, or other concerns',
    value: true,
  },
]

const concernsSpecificsOptions = [
  {
    label: 'Clarity concerns',
    value: 'clarity',
  },
  {
    label: 'Grammatical or structural concerns',
    value: 'gramatical',
  },
  {
    label: 'Other Item construction concerns',
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
        <p><strong>You identified content-related issues; please select all that apply:</strong></p>
        <p>${renderAnswersList(
          issuesOptions,
          responses.issuesIdentification,
        )}</p>
        
        <p><strong>Please explain the issue(s) in greater detail:</strong></p>
        <p>${responses.issuesDetails}</p>
        `
  } else {
    // step 3
    content += `
        <p><strong>Is the item aligned to the appropriate Learning Objective or Bioskills?</strong></p>
        <p>${renderAnswer(yesOrNoOptions, responses.curriculaAlignment)}</p>

        <p><strong>Do you think that the item targets the Bloom’s level as written?</strong></p>
        <p>${renderAnswer(yesOrNoOptions, responses.bloomLevel)}</p>

        <p><strong>Please provide feedback about the Learning Objective, Bioskills alignment, or Bloom's level.</strong></p>
        <p>${responses.alignmentFeedback || '-'}</p>

        <p><strong>What is the item type that you are reviewing?</strong></p>
        <p>${renderAnswer(
          questionTypesOptions,
          responses.questionType,
        )}</p>        
        `

    if (
      responses.questionType === 'multipleChoiceSingleCorrect' ||
      responses.questionType === 'multipleChoice'
    ) {
      content += `
                <p><strong>Evaluating item distractors:</strong></p>
                <p>${renderAnswer(
                  distractorsOptions,
                  responses.distractors,
                )}</p>
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
            <p><strong>You identified feedback-related issues; please select all that apply:</strong></p>
            <p>${renderAnswersList(
              feedbackIssuesOptions,
              responses.feedbackIssues,
            )}</p>
        `

      if (responses.feedbackIssues.indexOf('other') > -1) {
        content += `
                <p><strong>Specify other feedback-related issues:</strong></p>
                <p>${responses.otherIssues}</p>
            `
      }

      content += `
                <p><strong>Please explain the issue(s) in greater detail:</strong></p>
                <p>${responses.feedbackIssuesDetails}</p>
            `
    }

    // step 4
    content += `
        <p><strong>The construction of this item has:</strong></p>
        <p>${renderAnswer(concernsOptions, responses.concerns)}</p>
    `

    if (responses.concerns) {
      content += `
            <p><strong>Which clarity, grammatical, structural, or other item construction concerns do you have? Select all that apply.</strong></p>
            <p>${renderAnswersList(
              concernsSpecificsOptions,
              responses.concernsSpecifics,
            )}</p>
        `

      if (responses.concernsSpecifics?.indexOf('other') > -1) {
        content += `
                  <p><strong>Specify other concerns about item construction:</strong></p>
                  <p>${responses.otherConcerns}</p>
              `
      }

      content += `
            <p><strong>Please explain the clarity-related issue(s) in greater detail:</strong></p>
            <p>${responses.concernsDetails}</p>
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
