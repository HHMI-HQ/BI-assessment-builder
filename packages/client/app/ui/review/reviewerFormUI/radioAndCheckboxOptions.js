export const yesOrNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]

export const difficultyOptions = [
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

export const hasIssuesOptions = [
  {
    label: 'There are NO content-related issues',
    value: false,
  },
  {
    label: 'There are content-related issues  ',
    value: true,
  },
]

export const issuesOptions = [
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

export const questionTypesOptions = [
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

export const distractorsOptions = [
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

export const feedbackEvaluationOptions = [
  {
    label: 'There are NO issues related to the feedback',
    value: 'noIssues',
  },
  {
    label: 'There are issues with the feedback',
    value: 'hasIssues',
  },
]

export const feedbackIssuesOptions = [
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

export const concernsOptions = [
  {
    label: 'No clarity, grammatical, structural, or other concerns',
    value: false,
  },
  {
    label: 'Clarity, grammatical, structural, or other concerns',
    value: true,
  },
]

export const concernsSpecificsOptions = [
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
