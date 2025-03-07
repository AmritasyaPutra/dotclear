<?php
/**
 * @class Optgroup
 * @brief HTML Forms optgroup creation helpers
 *
 * @package Dotclear
 *
 * @copyright Olivier Meunier & Association Dotclear
 * @copyright GPL-2.0-only
 */
declare(strict_types=1);

namespace Dotclear\Helper\Html\Form;

class Optgroup extends Component
{
    private const DEFAULT_ELEMENT = 'optgroup';

    /**
     * Constructs a new instance.
     *
     * @param      string       $text     The optgroup text
     * @param      null|string  $element  The element
     */
    public function __construct(string $text, ?string $element = null)
    {
        parent::__construct(self::class, $element ?? self::DEFAULT_ELEMENT);
        $this
            ->text($text);
    }

    /**
     * Renders the HTML component.
     *
     * @param      null|string  $default   The default value
     *
     * @return     string
     */
    public function render(?string $default = null): string
    {
        $buffer = '<' . ($this->getElement() ?? self::DEFAULT_ELEMENT) .
            (isset($this->text) ? ' label="' . $this->text . '"' : '') .
            $this->renderCommonAttributes() . '>' . "\n";

        if (isset($this->items) && is_array($this->items)) {
            foreach ($this->items as $item => $value) {
                if ($value instanceof Option || $value instanceof Optgroup) {
                    $buffer .= $value->render($default);
                } elseif (is_array($value)) {
                    /* @phpstan-ignore-next-line */
                    $buffer .= (new Optgroup((string) $item))->items($value)->render($this->default ?? $default ?? null);
                } else {
                    /* @phpstan-ignore-next-line */
                    $buffer .= (new Option((string) $item, (string) $value))->render($this->default ?? $default ?? null);
                }
            }
        }

        $buffer .= '</' . ($this->getElement() ?? self::DEFAULT_ELEMENT) . '>' . "\n";

        return $buffer;
    }

    /**
     * Gets the default element.
     *
     * @return     string  The default element.
     */
    public function getDefaultElement(): string
    {
        return self::DEFAULT_ELEMENT;
    }
}
