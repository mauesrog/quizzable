let backgroundFaded = false;
let numberOfQuestions = null;
let offsetRight = false;

$(document).ready(() => {
  main();
});

function main() {
  const { questionSet, weights, shows } = data;
  numberOfQuestions = questionSet.length;

  setScrollAnimation(questionSet);

  $('body').find('.submit').click(e => {
    return $('.moved').length ? hideResult() : showResult(shows, weights);
  });

  $('a').click(e => {
    const choices = $("input[type='radio']:checked").map((i, radio) => {
      return  $(radio).val();
    }).toArray();

    return choices.length === numberOfQuestions;
  });

  createQuestions(questionSet);
}

function showResult(shows, weights) {
  const choices = $("input[type='radio']:checked").map((i, radio) => {
    return  $(radio).val();
  }).toArray();

  const results = shows.map(el => { return 0; });

  choices.forEach((choice, i) => {
    results[choice] += weights[i];
  });

  if (!$('#result div').length) {
    let maxShowScore = Number.NEGATIVE_INFINITY;
    let maxIndex = null;

    results.forEach((result, i) => {
      if (result > maxShowScore) {
        maxShowScore = result;
        maxIndex = i;
      }
    });

    const { name, img, explanation } = shows[maxIndex];

    $('#result h2').text(name);
    $('#result p').text(explanation);
    $('#result').css('background-image', `url("images/${img}")`);
  }

  $('#result').addClass('show');
  $arrow = $('.fa-chevron-down');
  $arrow.addClass('moved');
  $('li.submit a').text('Want a new home?');

  $arrow.addClass('rotated');

  location.href = "#result";

  return false;
}

function hideResult() {
  $('.fa-chevron-down').removeClass('moved').removeClass('rotated').addClass('normal');
  $('#result').removeClass('show');

  $('li.submit a').text('Visit your new home');

  return false;
}

function setScrollAnimation(questionSet) {
  const $window = $(window);

  window.scrollTo(0, 0);

  $window.scroll(e => {
    if ($window.scrollTop() > 20 && !backgroundFaded) {
      backgroundFaded = true;
      $('header').addClass('shrunk');
    }

    if ($('#result').is('.show') && $window.scrollTop() < 850) {
      console.log('here');
      hideResult();
    }
  });
}

function createQuestions(questionSet) {
  questionSet.forEach(({ options, question }, i) => {
    const $currQuestion = $(`<div class="question" id=${i}>`).appendTo($('#questions'));
    const $questionText = $(`<h2>${question}</h2>`).appendTo($currQuestion);
    const $images = $('<div class="images">').appendTo($currQuestion);
    const $arrowRight = $('<div class="arrow right"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>').appendTo($currQuestion);
    const $arrowLeft = $('<div class="arrow left"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>').appendTo($currQuestion);

    $arrowRight.click(e => { navigate($currQuestion); });
    $arrowLeft.click(e => { navigate($currQuestion, true); });

    generateQuestion($images, options, i);
  });
}

function navigate($question, left) {
  if (left) $question.removeClass('right');
  else $question.addClass('right');
}

function generateQuestion($images, options, id) {
  const $options = options.map(({ text, img, show }, i) => {
    const $option = $(`<div class="option" id=${show} key=${i}>`).appendTo($images);
    const $label = $(`<label>`).appendTo($option);


    const $img = $(`<img src="images/${img}" alt="${text}">`).appendTo($label);
    const $radio = $(`<input type="radio" name="${id}" value=${show}>`).appendTo($label);
    const $titleMask = $(`<div class='mask'>`).appendTo($label);
    const $title = $(`<h3>${text}</h3>`).appendTo($titleMask);

    return $option;
  });

  $options.forEach(($option, i) => {
    $option.click(e => {
      handleOptionClick($option, $options);
    });

    $option.mouseenter(e => {
      handleOptionMouseEnter($options.slice(0, i), parseInt($option.attr('key'), 10));
    });

    $option.mouseleave(e => {
      handleOptionMouseLeave($options.slice(0, i), parseInt($option.attr('key'), 10));
    });
  });
}

function handleOptionClick($option, $options) {
  const choices = $("input[type='radio']:checked").map((i, radio) => {
    return  $(radio).val();
  }).toArray();
  const key = $option.attr('key');
  $option.addClass('selected');
  $option.removeClass('inactive');

  for (const $opt of $options) {
    if ($opt.attr('key') !== key) {
        $opt.removeClass('selected');
        $opt.addClass('inactive');
    }
  }

  if (choices.length === numberOfQuestions) {
    $('body').addClass('ready');
  }
}

function handleOptionMouseEnter($options, key) {
  if (key === 4 || key === 5) {
    for (const $opt of $options) {
      $opt.addClass(key === 4 ? 'offset' : 'negative-offset');
    }
  }
}

function handleOptionMouseLeave($options, key) {
  if (key === 4 || key === 5) {
    for (const $opt of $options) {
      $opt.removeClass('offset negative-offset');
    }
  }
}
