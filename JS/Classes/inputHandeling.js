class InputHandler {
    constructor() {
        this.keys = [];
        this.lastkey = '';
        window.addEventListener('blur', () => {
            this.keys = [];
        });
        
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === ' ') &&
                this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
            if (e.key === 'Shift') {
                e.preventDefault();
                if (this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            }
            if (e.key === ' ') {
                this.lastkey = 'Space';
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === ' ' ||
                e.key === 'Shift') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });

    }
}
