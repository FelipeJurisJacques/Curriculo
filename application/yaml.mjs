export default class Yaml {
    static decode(text) {
        const lines = text.split('\n');
        const result = Yaml.recursiveDecode(lines);
        console.log(JSON.stringify(result, null, 2));
        return result;
    }
    static recursiveDecode(lines) {
        if (lines.length === 1) {
            const value = lines[0];
            if (value !== undefined && !Yaml.key(value)) {
                return Yaml.value(value);
            }
        }
        let result = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line === undefined)
                continue;
            const trim = Yaml.trim(line);
            if (!trim)
                continue;
            if (!result) {
                result = line.trim().startsWith('-') ? [] : {};
            }
            const tab = Yaml.tab(line);
            if (Array.isArray(result)) {
                const sub = [
                    `${' '.repeat(tab)}${trim}`,
                ];
                for (let j = i + 1; j < lines.length; j++) {
                    const l = lines[j];
                    if (l === undefined) {
                        break;
                    }
                    if (l.trim().startsWith('-')) {
                        break;
                    }
                    else {
                        sub.push(l);
                        i = j;
                    }
                }
                if (sub.length) {
                    result.push(Yaml.recursiveDecode(sub));
                }
            }
            else {
                if (trim.endsWith(':')) {
                    const sub = [];
                    for (let j = i + 1; j < lines.length; j++) {
                        const l = lines[j];
                        if (l === undefined) {
                            break;
                        }
                        if (Yaml.tab(l) > tab) {
                            sub.push(l);
                            i = j;
                        }
                        else {
                            break;
                        }
                    }
                    result[Yaml.key(line)] = Yaml.recursiveDecode(sub);
                }
                else {
                    result[Yaml.key(line)] = Yaml.value(line);
                }
            }
        }
        return result;
    }
    static tab(value) {
        for (let i = 0; i < value.length; i++) {
            const char = value[i];
            if (char !== undefined && char !== ' ' && char !== '-') {
                return i;
            }
        }
        return value.length;
    }
    static trim(value) {
        if (value) {
            value = value.trim();
            if (value && value.startsWith('-')) {
                value = value.substring(1).trim();
            }
            let str = false;
            for (let i = 0; i < value.length; i++) {
                const char = value[i];
                if (char === undefined)
                    continue;
                switch (char) {
                    case '"':
                        str = !str;
                        break;
                    case '#':
                        if (!str) {
                            value = value.substring(0, i);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return value;
    }
    static value(value) {
        value = value.trim();
        if (value) {
            if (value.startsWith('-')) {
                value = value.substring(1).trim();
            }
            if (value) {
                let key = true;
                let result = '';
                for (let i = 0; i < value.length; i++) {
                    const c = value[i];
                    if (c === undefined)
                        continue;
                    if (key) {
                        if (c === ':') {
                            result = '';
                            continue;
                        }
                        if (c !== '_'
                            && !(i === 0 && /^[a-zA-Z]+$/.test(c))
                            && !(i > 0 && /^[a-zA-Z0-9]+$/.test(c))) {
                            key = false;
                        }
                    }
                    result += c;
                }
                result = result.trim();
                if (!result) {
                    return null;
                }
                if (result === 'true') {
                    return true;
                }
                if (result === 'false') {
                    return false;
                }
                if (result.indexOf(':') === -1) {
                    const float = parseFloat(result);
                    if (!isNaN(float)) {
                        return float;
                    }
                    const integer = parseInt(result);
                    if (!isNaN(integer)) {
                        return integer;
                    }
                }
                if (result.startsWith('"') && result.endsWith('"')) {
                    return result.substring(1, result.length - 1);
                }
                return result;
            }
        }
        return null;
    }
    static key(value) {
        let key = '';
        value = value.trim();
        if (value) {
            if (value.startsWith('-')) {
                value = value.substring(1).trim();
            }
            for (let i = 0; i < value.length; i++) {
                const c = value[i];
                if (c === undefined)
                    break;
                if (c === '_'
                    || (i === 0 && /^[a-zA-Z]+$/.test(c))
                    || (i > 0 && /^[a-zA-Z0-9]+$/.test(c))) {
                    key += c;
                }
                else if (c === ':') {
                    return key;
                }
                else {
                    break;
                }
            }
        }
        return '';
    }
}
//# sourceMappingURL=yaml.mjs.map