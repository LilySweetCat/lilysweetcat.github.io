(function(){
    if(!window.Lampa) return;

    let SKIP_SECONDS = 10;

    Lampa.Manifest.plugins = {
        name: 'player-skip-buttons',
        version: '1.2.0',
        description: 'Adds visible skip forward/backward buttons to the player panel'
    };

    function waitForPlayer(cb){
        if(Lampa.Player && Lampa.Player.listener) cb();
        else setTimeout(()=> waitForPlayer(cb), 500);
    }

    waitForPlayer(function(){

        Lampa.Template.add('player_skip_css', `
            <style>
                .player-panel__skip-back,
                .player-panel__skip-forward {
                    width: 2.8em;
                    height: 2.8em;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.15);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    flex-shrink: 0;
                }

                .player-panel__skip-back svg,
                .player-panel__skip-forward svg {
                    width: 1.4em;
                    height: 1.4em;
                    fill: #fff;
                }

                .player-panel__skip-back:hover,
                .player-panel__skip-forward:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }

                .player-panel__skip-back.focus,
                .player-panel__skip-forward.focus {
                    background: #fff;
                    transform: scale(1.15);
                    box-shadow: 0 0 0.5em rgba(255,255,255,0.5);
                }

                .player-panel__skip-back.focus svg,
                .player-panel__skip-forward.focus svg {
                    fill: #000;
                }
            </style>
        `);

        let css = document.createElement('div');
        css.innerHTML = Lampa.Template.get('player_skip_css');
        document.body.appendChild(css);

        let iconBack = '<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="8" y="15.5" font-size="6.5" font-weight="bold" font-family="sans-serif">10</text></svg>';
        let iconForward = '<svg viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="7.5" y="15.5" font-size="6.5" font-weight="bold" font-family="sans-serif">10</text></svg>';

        Lampa.Player.listener.follow('start', function(){
            setTimeout(function(){
                let panel = $('.player-panel');
                if(!panel.length) return;

                let center = panel.find('.player-panel__center');
                if(!center.length) return;

                if(!center.find('.player-panel__skip-back').length){
                    let playpause = center.find('.player-panel__playpause');
                    playpause.before('<div class="player-panel__skip-back button selector">' + iconBack + '<div class="tooltip">-' + SKIP_SECONDS + ' сек</div></div>');
                }

                if(!center.find('.player-panel__skip-forward').length){
                    let playpause = center.find('.player-panel__playpause');
                    playpause.after('<div class="player-panel__skip-forward button selector">' + iconForward + '<div class="tooltip">+' + SKIP_SECONDS + ' сек</div></div>');
                }

                panel.find('.player-panel__skip-back').off('hover:enter').on('hover:enter', function(){
                    let vid = Lampa.PlayerVideo.video();
                    if(vid && vid.duration){
                        Lampa.PlayerVideo.to(Math.max(0, vid.currentTime - SKIP_SECONDS));
                    }
                });

                panel.find('.player-panel__skip-forward').off('hover:enter').on('hover:enter', function(){
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
