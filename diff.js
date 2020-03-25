const diffClazz = function (oldStr, newStr) {
    this.oldStr = oldStr;
    this.newStr = newStr;
    this.matchs = [];
    this.getSteps = function() {
        this.findLongestMatch(0, this.oldStr.length, 0, this.newStr.length);
        console.log(this.matchs);
        return this.matchs.map(i => Object.values(i).slice(0,5));
    };
    this.findLongestMatch = function(oldStartIdx, oldEndIdx, newStartIdx, newEndIdx) {
        console.log(...arguments);
        const oldStr = this.oldStr;
        const newStr = this.newStr;
        let bestMatch = {
            type: '',
            oldStartIdx,
            oldEndIdx,
            newStartIdx,
            newEndIdx,
            count: 0
        };
        let lastMatch = {};
        // 优化数据结构
        let curMatch = {};
        for (let i = oldStartIdx; i < oldEndIdx; i++) {
            for (let j = newStartIdx; j < newEndIdx; j++) {
                curMatch[`${i}&${j}`] = 0;
                if (oldStr[i] === newStr[j]) {
                    if (i > oldStartIdx && j > newStartIdx && lastMatch[`${i-1}&${j-1}`]) {
                        curMatch[`${i}&${j}`] = lastMatch[`${i-1}&${j-1}`];
                    }
                    curMatch[`${i}&${j}`]++;
                    const curMatchCount = curMatch[`${i}&${j}`];
                    if(curMatchCount > bestMatch.count) {
                        bestMatch = {
                            type: 'equal',
                            oldStartIdx: i - curMatchCount + 1,
                            oldEndIdx: i + 1,
                            newStartIdx: j - curMatchCount + 1,
                            newEndIdx: j + 1,
                            count: curMatchCount                        
                        }                    
                    }
                }
            }
            lastMatch = curMatch;
            curMatch = {};
        }
        if (bestMatch.count) {
            if (oldStartIdx < bestMatch.oldStartIdx || newStartIdx < bestMatch.newStartIdx) {
                this.findLongestMatch(oldStartIdx, bestMatch.oldStartIdx, newStartIdx, bestMatch.newStartIdx);             
            }
            this.matchs.push(bestMatch);
            if (bestMatch.oldEndIdx < oldEndIdx || bestMatch.newEndIdx < newEndIdx) {
                this.findLongestMatch(bestMatch.oldEndIdx, oldEndIdx, bestMatch.newEndIdx, newEndIdx);             
            }
        } else {
            if (oldStartIdx < oldEndIdx && newStartIdx < newEndIdx) {
                bestMatch.type = 'replace';
            } else if (oldStartIdx < oldEndIdx) {
                bestMatch.type = 'delete';
            } else if (newStartIdx < newEndIdx) {
                bestMatch.type = 'insert';
            }
            this.matchs.push(bestMatch);       
        }
    }
}

diffClazz.SplitToLines = function(str) {
    const lfpos = str.indexOf("\n");
    const crpos = str.indexOf("\r");
    const linebreak = ((lfpos > -1 && crpos > -1) || crpos < 0) ? "\n" : "\r";
    const lines = str.split(linebreak);
    lines.map(i => i.replace(/^[\n\r]*|[\n\r]*$/g, ""));
    return lines;
}