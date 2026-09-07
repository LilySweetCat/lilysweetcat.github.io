(function(){
    if(!window.Lampa) return;

    let SKIP_SECONDS = 10;

    Lampa.Manifest.plugins = {
        name: 'player-skip-buttons',
        version: '1.0.0',
        description: 'Adds visible skip forward/backward buttons to the player panel'
    };

    function waitForPlayer(cb){
        if(Lampa.Player && Lampa.Player.listener) cb();
        else setTimeout(()=> waitForPlayer(cb), 500);
    }

    waitForPlayer(function(){

        Lampa.Template.add('player_skip_buttons', `
            <div class="player-panel__skip-buttons">
                <div class="player-panel__skip-back button selector" data-skip="-${SKIP_SECONDS}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12.5 3C7.26 3 3 7.26 3 12.5S7.26 22 12.5 22c4.5 0 8.28-3.13 9.24-7.34l-2.08-.63C18.86 18.76 15.93 21 12.5 21 7.86 21 4 17.14 4 12.5S7.86 4 12.5 4c2.07 0 3.95.76 5.4 2l-3.9 3.9h7V1h-7.5l2.5 2.5C14.88 1.92 13.73 1.5 12.5 1.5z"/>
                        <text x="9" y="15.5" font-size="7" font-weight="bold" fill="white" font-family="sans-serif">${SKIP_SECONDS}</text>
                    </svg>
                    <div class="tooltip">-${SKIP_SECONDS} сек</div>
                </div>
                <div class="player-panel__skip-forward button selector" data-skip="${SKIP_SECONDS}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M11.5 3C16.74 3 21 7.26 21 12.5S16.74 22 11.5 22c-4.5 0-8.28-3.13-9.24-7.34l2.08-.63C5.14 18.76 8.07 21 11.5 21c4.64 0 8.5-3.86 8.5-8.5S16.14 4 11.5 4c-2.07 0-3.95.76-5.4 2l3.9 3.9h-7V14h7.5l-2.5-2.5C9.12 13.08 10.27 13.5 11.5 13.5z"/>
                        <text x="7" y="15.5" font-size="7" font-weight="bold" fill="white" font-family="sans-serif">${SKIP_SECONDS}</text>
                    </svg>
                    <div class="tooltip">+${SKIP_SECONDS} сек</div>
                </div>
            </div>
        `);

        Lampa.Template.add('player_skip_buttons_css', `
            <style>
                .player-panel__skip-buttons {
                    display: flex;
                    align-items: center;
                    gap: 1.5em;
                }

                .player-panel__skip-back,
                .player-panel__skip-forward {
                    width: 2.8em;
                    height: 2.8em;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s;
                    position: relative;
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

                .player-panel__skip-back.focus svg text,
                .player-panel__skip-forward.focus svg text {
                    fill: #000;
                }

                .player-panel__center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2em;
                }

                .player-panel__center .player-panel__skip-buttons {
                    order: -1;
                }

                .player-panel__center .player-panel__playpause {
                    order: 0;
                }
            </style>
        `);

        let skipCss = document.createElement('div');
        skipCss.innerHTML = Lampa.Template.get('player_skip_buttons_css');
        document.body.appendChild(skipCss);

        Lampa.Player.listener.follow('start', function(){
            setTimeout(function(){
                let panel = $('.player-panel');
                if(!panel.length) return;

                let center = panel.find('.player-panel__center');
                if(!center.length) return;

                if(!center.find('.player-panel__skip-buttons').length){
                    center.prepend(Lampa.Template.get('player_skip_buttons'));
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
