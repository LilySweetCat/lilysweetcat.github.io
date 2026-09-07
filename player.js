(function(){
    if(!window.Lampa) return;

    let SKIP_SECONDS = 10;

    Lampa.Manifest.plugins = {
        name: 'player-skip-buttons',
        version: '1.1.0',
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
                    font-size: 1.1em;
                    font-weight: bold;
                    color: #fff;
                    flex-shrink: 0;
                }

                .player-panel__skip-back:hover,
                .player-panel__skip-forward:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }

                .player-panel__skip-back.focus,
                .player-panel__skip-forward.focus {
                    background: #fff;
                    color: #000;
                    transform: scale(1.15);
                    box-shadow: 0 0 0.5em rgba(255,255,255,0.5);
                }

                .player-panel__left {
                    display: flex;
                    align-items: center;
                    gap: 0.8em;
                }

                .player-panel__right .player-panel__skip-forward {
                    margin-right: 0.8em;
                }
            </style>
        `);

        let css = document.createElement('div');
        css.innerHTML = Lampa.Template.get('player_skip_css');
        document.body.appendChild(css);

        Lampa.Player.listener.follow('start', function(){
            setTimeout(function(){
                let panel = $('.player-panel');
                if(!panel.length) return;

                if(!panel.find('.player-panel__skip-back').length){
                    let left = panel.find('.player-panel__left');
                    left.prepend('<div class="player-panel__skip-back button selector">&lt;&lt;</div>');
                }

                if(!panel.find('.player-panel__skip-forward').length){
                    let right = panel.find('.player-panel__right.player-panel__tv-visible .player-panel__box-buttons').first();
                    right.before('<div class="player-panel__skip-forward button selector">&gt;&gt;</div>');
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
