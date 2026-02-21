; first.ks
*start 
 
     [call storage="resizecall.ks"] 
     ; もしレスポンシブ対応を入れるなら

    ; タイトル画面表示用のラベルへジャンプ
    [jump target="*show_title_screen"]

*show_title_screen
    [cm] 
    
    [clearfix]
     ; 前景レイヤ（キャラクターなど）クリア
    @layopt layer=message0 visible=false
     ; メッセージウィンドウを非表示
    [stopbgm] 


*prologue_start
  ; ★★★ クリック入力を一時的に無効化 ★★★
    [wait_cancel]
    ; ★★★ ゲーム本編の開始処理 ★★★
    [stopbgm] 
    ; タイトルBGMを止める
    [cm]
    [clearfix] 
    ; タイトルロゴやボタンを消す
    ; または [free name="game_title_text"] [free name="start_button"] [free name="load_button"] で個別に消す

    @layopt layer=message0 visible=true 
    ; メッセージウィンドウを表示
    [wait time=10] 

    ; 画面リフレッシュ
   ; [bg storage="calc_space.jpg" time="0"]
   ; [wait time=10] 
    ; プロローグの開始 (BGM再生、背景表示、メッセージウィンドウ設定など)
   [playbgm storage="enzan.mp3" loop="true"]
    [bg storage="calc_space.jpg" time="1000"]
    [wait time=10] 
    [position layer="message0" left="25" top="600" width="400" height="180" page=fore visible=true]
    [position layer="message0" page=fore margint="25" marginl="25" marginr="25" marginb="25"]
    [wait time=10] 
    [ptext name="chara_name_area" layer="message0" color="white" size="20" bold="true" x="40" y="605" visible="false"]
    [chara_config ptext="chara_name_area"]
[wait time=10] 
  ; ★★★ 演出完了後、クリック入力を再度有効化 ★★★
    [jump target="*start2"]
 *start2
 [popopo type="triangle" volume="40"]
#
君は、見たこともない空間にいる。[r]幻想的な一面の花畑、[r]とても現実とは思えない。[p]
   [chara_new name="roger" storage="roger_normal.png" jname="ロジャー"]
[chara_show name="roger" x="200" y="150"]
; ★★★ ロジャーの名前を表示するために ptext を再設定 ★★★
[ptext name="chara_name_area" layer="message0" color="white" size="20" bold="true" x="40" y="605" text="&sf._system_config_chara_ptext_first_name || ''" visible="true"]
; [chara_config ptext="chara_name_area"] ← これは[ptext]定義の直後に一度で良い場合が多い

#ロジャー
おはよう！お呼びとあらば即参上できない！[r]
今日も今日とて限界勤務上等の[r]
オロロジャイアちゃんでっす！[p]

ｵﾎﾝｴﾍﾝ...!ここは演算世界。[r]
僕の力で作り出された世界。[r]
あらゆる可能性を探るための場所さ。[p]

これから君には僕と一緒に[r]
旅をしてもらいたいんだ。[p]
そう！君がチョコをもらえる世界を[r]
探り出す為に！[p]
そんな訳で早速行ってみよう〜！[r]
と言っても...僕は一緒に行ける訳ではないんだけどね！[r]
社畜の悲しみ！[p]
代わりにガチャ回させてあげるから許して！[p]
はい！10連ガチャガチャっとね！[p]

; ロジャー退場
[chara_hide name="roger" time="500" wait="true"]

; ガチャ演出 (今は省略、SEや簡単なアニメーションを入れることも可能)

#
1人の仲間が目の前に現れる。[p]



#？？？
それじゃあ、団長ちゃん、一緒に行こっか♪[p]

; first.ks の選択肢部分 (glinkバージョン)
#
; ... (前の行まで) ...
仲間になったのは...[l]

  
; 選択肢 (glinkを使用)
; x, y, width, size は縦画面のレイアウトに合わせて調整してください
[glink color="blue" x="70" y="200" width="200" size="24" text="ナルメア" target="*narumia_route_start"]
[glink color="blue" x="70" y="270" width="200" size="24" text="シエテ" target="*siete_route_start"]
[glink color="blue" x="70" y="340" width="200" size="23" text="誰も仲間にしない" target="*hard_mode_start"]

; ★★★ 追加の選択肢ボタンを、最初は画面外の見えない位置に定義しておく ★★★

[if exp="sf.hard_mode_cleared == true"]
[glink name="secret_route_button"  x="-1000" y="-1000"    text="フェニー" target="*fenny_route_start"]

    [anim name="secret_route_button" left="60" top="450" time="0"] 
[endif]
[s]

; ----- 各ルートへの分岐先ラベル (これらは別の .ks ファイルに分けても良い) -----
*narumia_route_start
 
  [chara_new name="narumia" storage="narumia_normal.png" jname="ナルメア"] 
  [chara_show name="narumia" time="500" wait="true"]
  #ナルメア
  よろしくね、団長ちゃん！[p]
 #
  [jump storage="narumia_scenario.ks" target="*cafe_scene"]


*siete_route_start
    ; シエテが仲間になる処理
    ; [chara_hide name="silhouette" time="100" wait="true"]
    [chara_new name="siete" storage="siete_normal.png" jname="シエテ"] 
    [chara_show name="siete" x="150" y="150" time="500" wait="true"]
    #シエテ
    やあ、団長ちゃん。俺と行くのかい？[p] 
   #
    [jump storage="siete_scenario.ks" target="*deck_scene_start"] 

*hard_mode_start
    ; ハードモード開始時の初期処理 (もしあれば)
    ; 例えば、特定のフラグを立てるなど
    ; [eval exp="f.hard_mode = true"]
    [chara_show name="roger" x="200" y="150"]
    #ロジャー
    え！？誰もいらない！？[p] 
    まぁ、君がそういうなら…[r]
    …その先は地獄だよ？[p]
    [chara_hide name="roger" time="500" wait="true"]
    
    [jump storage="hard_scenario.ks" target="*auguste_arrival"]

*fenny_route_start
    [chara_new name="fenny" storage="fenny_normal.png" jname="フェニー"] 
    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    団長さんとお出かけ楽しみなんだよ！[p]
    [jump storage="fenny_scenario.ks" target="*port_breeze_arrival"] 

*show_load_screen
    ; [playse storage="select_se.wav"]
    [showload] ; ロード画面を表示
    ; ロード後、タイトルに戻るか、ゲーム再開かは showload の挙動次第
    [jump target="*show_title_screen"] 
    ; タイトル画面に再ジャンプするのが無難
[s]


; ----- 説明表示用ラベル (任意) -----
*show_narumia_desc
  [mtext text="【ナルメア】\nイージーモード。３つのエンディングが存在します。\nまずはここから始めることをお勧めします" size="20" x="300" y="200" time="500"]
  [wait time=3000] // 3秒待つ
  [mtext_hide time="500"]
  [jump target="*start"] // 選択肢に戻る (または元の場所を記憶して戻る)


; このファイルはここで終わり (各ルートは別ファイルにジャンプする想定)
; もし同じファイルに続けるなら @endjump は不要
