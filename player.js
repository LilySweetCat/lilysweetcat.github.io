(function(){
    if(!window.Lampa) return;

    let SKIP_SECONDS = 10;

    Lampa.Manifest.plugins = {
        name: 'player-skip-buttons',
        version: '1.3.0',
        description: 'Adds visible skip forward/backward buttons to the player panel'
    };

    function waitForPlayer(cb){
        if(Lampa.Player && Lampa.Player.listener) cb();
        else setTimeout(()=> waitForPlayer(cb), 500);
    }

    waitForPlayer(function(){

        if(!document.getElementById('player-skip-css')){
            let style = document.createElement('style');
            style.id = 'player-skip-css';
            style.textContent = `
                .player-panel__skip-back,
                .player-panel__skip-forward {
                    width: 2.8em !important;
                    height: 2.8em !important;
                    border-radius: 50% !important;
                    background: rgba(255,255,255,0.15) !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer;
                    flex-shrink: 0;
                    color: #fff !important;
                }

                .player-panel__skip-back svg,
                .player-panel__skip-forward svg {
                    width: 1.4em !important;
                    height: 1.4em !important;
                    fill: #fff !important;
                }

                .player-panel__skip-back svg path,
                .player-panel__skip-back svg text,
                .player-panel__skip-forward svg path,
                .player-panel__skip-forward svg text {
                    fill: #fff !important;
                }

                .player-panel__skip-back:hover,
                .player-panel__skip-forward:hover {
                    background: rgba(255,255,255,0.3) !important;
                    transform: scale(1.1);
                }

                .player-panel__skip-back.focus,
                .player-panel__skip-forward.focus {
                    background: #fff !important;
                    color: #000 !important;
                    transform: scale(1.15);
                }

                .player-panel__skip-back.focus svg,
                .player-panel__skip-forward.focus svg,
                .player-panel__skip-back.focus svg path,
                .player-panel__skip-back.focus svg text,
                .player-panel__skip-forward.focus svg path,
                .player-panel__skip-forward.focus svg text {
                    fill: #000 !important;
                }
            `;
            document.head.appendChild(style);
        }

        let iconBack = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="8" y="15.5" font-size="6.5" font-weight="bold" font-family="sans-serif">10</text></svg>';
        let iconForward = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="7.5" y="15.5" font-size="6.5" font-weight="bold" font-family="sans-serif">10</text></svg>';

        Lampa.Player.listener.follow('start', function(){
            setTimeout(function(){
                let panel = $('.player-panel');
                if(!panel.length) return;

                let center = panel.find('.player-panel__center');
                if(!center.length) return;

                let backBtn = center.find('.player-panel__skip-back');
                if(!backBtn.length){
                    let playpause = center.find('.player-panel__playpause');
                    playpause.before('<div class="player-panel__skip-back button selector">' + iconBack + '<div class="tooltip">-' + SKIP_SECONDS + ' сек</div></div>');
                    backBtn = center.find('.player-panel__skip-back');
                }

                let fwdBtn = center.find('.player-panel__skip-forward');
                if(!fwdBtn.length){
                    let playpause = center.find('.player-panel__playpause');
                    playpause.after('<div class="player-panel__skip-forward button selector">' + iconForward + '<div class="tooltip">+' + SKIP_SECONDS + ' сек</div></div>');
                    fwdBtn = center.find('.player-panel__skip-forward');
                }

                backBtn.off('hover:enter').on('hover:enter', function(){
                    let vid = Lampa.PlayerVideo.video();
                    if(vid && vid.duration){
                        Lampa.PlayerVideo.to(Math.max(0, vid.currentTime - SKIP_SECONDS));
                    }
                });

                fwdBtn.off('hover:enter').on('hover:enter', function(){
                    let vid = Lampa.PlayerVideo.video();
                    if(vid && vid.duration){
                        Lampa.PlayerVideo.to(Math.min(vid.duration, vid.currentTime + SKIP_SECONDS));
                    }
                });
            }, 500);
        });

        console.log('Player','[skip-buttons] plugin loaded');
    });
})();