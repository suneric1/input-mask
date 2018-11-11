angular.module('yourModuleName').directive('inputMask', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      inputMask: '@'
    },
    link: function (scope, element, attrs, ctrl) {
      const _m = new Mask(scope.inputMask);

      ctrl.$parsers.push(function (viewValue) {
        const value = _m.sanitizeValue(ctrl.$$rawModelValue, viewValue);
        const caretPos = _m.calcCaretPos(element[0].selectionStart);

        ctrl.$setViewValue(_m.formatter(value));
        ctrl.$render();

        element[0].selectionStart = caretPos;
        element[0].selectionEnd = caretPos;

        return value;
      });

      ctrl.$formatters.push(function (value) {
        return _m.formatter(value);
      });

      ctrl.$validators.length = function (modelValue) {
        modelValue = modelValue || '';
        return modelValue.length === _m.getRequiredLength();
      };

      function Mask(template) {
        this.template = template;
        this.insertions = getInsertionByTpl(template);

        function getInsertionByTpl(tpl) {
          const insertions = [];
          for (let i = 0, ri = 0, strEnded = true; i < tpl.length; i++) {
            if (tpl[i] === 'x') {
              strEnded = true;
              ri++;
              continue;
            }
            if (strEnded) {
              insertions.push({
                str: tpl[i],
                pos: ri,
                formattedPos: i
              });
              strEnded = false;
            } else {
              insertions[insertions.length - 1].str += tpl[i];
            }
          }
          return insertions;
        }

        this.sanitizeValue = (prevValue, viewValue) => {
          const length = this.getRequiredLength();
          const newValue = viewValue.replace(/[^0-9]/g, '').slice(0, length);

          if (prevValue) {
            const prevViewValue = this.formatter(prevValue);
            if (prevViewValue.length > viewValue.length && prevValue === newValue) {
              return newValue.slice(0, -1);
            }
          }

          return newValue;
        };

        this.calcCaretPos = (pos) => {
          this.insertions.forEach((ins) => {
            if (pos >= ins.formattedPos && pos <= ins.formattedPos + ins.str.length) {
              pos = Math.min(pos + ins.str.length, ins.formattedPos + ins.str.length + 1);
            }
          });

          return pos;
        };

        this.formatter = (input) => {
          if (!input) {
            return;
          }

          for (let i = this.insertions.length - 1; i >= 0; i--) {
            const { pos, str } = this.insertions[i];
            if (pos === 0) {
              input = str + input;
            } else if (input.charAt(pos - 1)) {
              input = input.slice(0, pos) + str + input.slice(pos);
            }
          }

          return input;
        };

        this.getRequiredLength = () => this.template.replace(/[^x]/g, '').length;
      }
    }
  };
});
